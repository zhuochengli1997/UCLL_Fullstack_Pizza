"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Place, UserData, UserRating, Visit } from "@/lib/types";
import { Header } from "./Header";
import { Landing } from "./Landing";
import { MapView } from "./MapView";
import { PlaceCard } from "./PlaceCard";
import { UserCard } from "./UserCard";

const STORAGE_KEY = "pizzaNow_userData";

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

  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

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
    }, 400);
  };

  const handleSelectPlace = useCallback((placeId: string) => {
    setSelectedPlaceId(placeId);
  }, []);

  const handlePlacesUpdate = useCallback((newPlaces: Place[]) => {
    setPlaces(newPlaces);

    if (newPlaces.length === 0) {
      setSelectedPlaceId(null);
      return;
    }

    // Always pick a random place once per completed search
    const randomIndex = Math.floor(Math.random() * newPlaces.length);
    setSelectedPlaceId(newPlaces[randomIndex].id);
  }, []);

  const selectedPlace = useMemo(
    () =>
      selectedPlaceId
        ? places.find((p) => p.id === selectedPlaceId) || null
        : null,
    [places, selectedPlaceId]
  );

  // (Optional) still used by UserCard; harmless to keep
const handleRatePlace = useCallback(
  (placeId: string, rating: number, note?: string) => {
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

      const newRatings =
        existingIndex >= 0
          ? prev.ratings.map((r, i) =>
              i === existingIndex ? updatedRating : r
            )
          : [...prev.ratings, updatedRating];

      const visit: Visit = {
        placeId,
        visitedAt: new Date().toISOString(),
        rating,
        note,
      };

      return {
        ratings: newRatings,
        visits: [...prev.visits, visit],
      };
    });
  },
  []
);


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
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={handleSelectPlace}
              onPlacesUpdate={handlePlacesUpdate}
            />
          </section>

          <section className="side-section">
            <div className="placecard-wrapper">
              <PlaceCard place={selectedPlace} />
            </div>

            <div className="usercard-wrapper">
              <UserCard
                places={places}
                userData={userData}
                selectedPlaceId={selectedPlaceId}
                onRate={handleRatePlace}
              />
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default PizzaNowApp;
