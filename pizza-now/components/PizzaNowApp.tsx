"use client";

import { useEffect, useState } from "react";
import { Place, UserData, UserRating, Visit } from "@/lib/types";
import { Header } from "./Header";
import { Landing } from "./Landing";
import { MapView } from "./MapView";
import { PlaceCard } from "./PlaceCard";
import { UserCard } from "./UserCard";

const STORAGE_KEY = "pizzaNow_userData";

const mockPlaces: Place[] = [
  {
    id: "1",
    name: "Napoli Express",
    address: "Main Street 12",
    lat: 50.879,
    lng: 4.701,
    rating: 4.5,
    distanceMeters: 300,
  },
  {
    id: "2",
    name: "Vesuvio Slice",
    address: "Central Square 5",
    lat: 50.88,
    lng: 4.699,
    rating: 4.2,
    distanceMeters: 550,
  },
  {
    id: "3",
    name: "Luigi's Pizza Lab",
    address: "Tech Park 3",
    lat: 50.881,
    lng: 4.703,
    rating: 4.8,
    distanceMeters: 750,
  },
];

const loadUserData = (): UserData => {
  if (typeof window === "undefined") return { ratings: [], visits: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ratings: [], visits: [] };
    return JSON.parse(raw);
  } catch {
    return { ratings: [], visits: [] };
  }
};

const saveUserData = (data: UserData) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const PizzaNowApp: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [landingFadeOut, setLandingFadeOut] = useState(false);
  const [places] = useState<Place[]>(mockPlaces);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(mockPlaces[0]);
  const [userData, setUserData] = useState<UserData>({ ratings: [], visits: [] });

  useEffect(() => {
    setUserData(loadUserData());
  }, []);

  useEffect(() => {
    saveUserData(userData);
  }, [userData]);

  const handlePizzaNowClick = () => {
    setLandingFadeOut(true);
    setTimeout(() => {
      setShowLanding(false);
    }, 400); // sync with CSS transition
  };

  const handleSelectPlace = (placeId: string) => {
    const place = places.find((p) => p.id === placeId) || null;
    setSelectedPlace(place);
  };

  const handleRatePlace = (placeId: string, rating: number, note?: string) => {
    setUserData((prev) => {
      const existingIndex = prev.ratings.findIndex(
        (r) => r.placeId === placeId
      );
      const updatedRating: UserRating = {
        placeId,
        rating,
        note,
        updatedAt: new Date().toISOString(),
      };

      let newRatings: UserRating[];
      if (existingIndex >= 0) {
        newRatings = [...prev.ratings];
        newRatings[existingIndex] = updatedRating;
      } else {
        newRatings = [...prev.ratings, updatedRating];
      }

      const visit: Visit = {
        placeId,
        visitedAt: new Date().toISOString(),
      };

      return {
        ratings: newRatings,
        visits: [...prev.visits, visit],
      };
    });
  };

  return (
    <div className="app-root">
      <Header />
      {showLanding ? (
        <Landing
          fadeOut={landingFadeOut}
          onPizzaNow={handlePizzaNowClick}
        />
      ) : (
        <main className="main-layout">
          <section className="map-section">
            <MapView
              places={places}
              selectedPlaceId={selectedPlace?.id || null}
              onSelectPlace={handleSelectPlace}
            />
          </section>
          <section className="side-section">
            <div className="placecard-wrapper">
              {selectedPlace && (
                <PlaceCard
                  place={selectedPlace}
                  userRating={
                    userData.ratings.find(
                      (r) => r.placeId === selectedPlace.id
                    ) || null
                  }
                  onRate={handleRatePlace}
                />
              )}
            </div>
            <div className="usercard-wrapper">
              <UserCard
                places={places}
                userData={userData}
                selectedPlaceId={selectedPlace?.id || null}
              />
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default PizzaNowApp;
