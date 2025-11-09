"use client";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
} from "@react-google-maps/api";
import { Place, PlaceReview } from "@/lib/types";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

interface MapViewProps {
  places: Place[];
  selectedPlaceId: string | null;
  onSelectPlace: (placeId: string) => void;
  onPlacesUpdate: (places: Place[]) => void;
}

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "16px",
};

const libraries: ("places")[] = ["places"];

const defaultCenter = {
  lat: 50.879,
  lng: 4.701,
};

const getDistanceMeters = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const MapView: React.FC<MapViewProps> = ({
  places,
  selectedPlaceId,
  onSelectPlace,
  onPlacesUpdate,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "pizza-now-google-maps-loader",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const centerRef = useRef(defaultCenter);
  const searchingRef = useRef(false);

  // Keep onPlacesUpdate stable inside runSearch
  const onPlacesUpdateRef = useRef(onPlacesUpdate);
  useEffect(() => {
    onPlacesUpdateRef.current = onPlacesUpdate;
  }, [onPlacesUpdate]);

  const runSearch = useCallback((center: { lat: number; lng: number }) => {
    if (!window.google || searchingRef.current) return;

    searchingRef.current = true;

    const tempMap = new window.google.maps.Map(
      document.createElement("div"),
      {
        center,
        zoom: 14,
      }
    );

    const service = new window.google.maps.places.PlacesService(tempMap);

    const request: google.maps.places.PlaceSearchRequest = {
      location: center,
      radius: 2000,
      type: "restaurant",
      keyword: "pizza",
    };

    service.nearbySearch(request, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        const sliced = results.slice(0, 10);

        const detailPromises = sliced.map(
          (r) =>
            new Promise<Place | null>((resolve) => {
              if (!r.place_id) return resolve(null);

              service.getDetails(
                {
                  placeId: r.place_id,
                  fields: [
                    "place_id",
                    "name",
                    "rating",
                    "vicinity",
                    "formatted_address",
                    "geometry",
                    "reviews",
                  ],
                },
                (detail, ds) => {
                  if (
                    ds ===
                      window.google.maps.places.PlacesServiceStatus.OK &&
                    detail &&
                    detail.geometry &&
                    detail.geometry.location
                  ) {
                    const lat = detail.geometry.location.lat();
                    const lng = detail.geometry.location.lng();
                    const distanceMeters = getDistanceMeters(
                      center.lat,
                      center.lng,
                      lat,
                      lng
                    );

                    const reviews: PlaceReview[] | undefined =
                      detail.reviews
                        ?.slice(0, 3)
                        .map((rev) => ({
                          authorName: rev.author_name,
                          rating: rev.rating,
                          text: rev.text,
                        }));

                    resolve({
                      id: detail.place_id!,
                      name:
                        detail.name ||
                        "Unknown pizza place",
                      address:
                        detail.vicinity ||
                        detail.formatted_address ||
                        "No address",
                      lat,
                      lng,
                      rating: detail.rating || 0,
                      distanceMeters,
                      reviews,
                    });
                  } else {
                    resolve(null);
                  }
                }
              );
            })
        );

        Promise.all(detailPromises).then((all) => {
          const mapped = all.filter(
            (p): p is Place => p !== null
          );
          onPlacesUpdateRef.current(mapped);
          searchingRef.current = false;
        });
      } else {
        onPlacesUpdateRef.current([]);
        searchingRef.current = false;
      }
    });
  }, []);

  // Initial search once after maps loaded
  useEffect(() => {
    if (!isLoaded) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const center = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          centerRef.current = center;
          runSearch(center);
        },
        () => {
          runSearch(centerRef.current);
        }
      );
    } else {
      runSearch(centerRef.current);
    }
  }, [isLoaded, runSearch]);

  const mapCenter = useMemo(() => {
    if (places.length === 0) return centerRef.current;

    const avgLat =
      places.reduce((sum, p) => sum + p.lat, 0) /
      places.length;
    const avgLng =
      places.reduce((sum, p) => sum + p.lng, 0) /
      places.length;

    return { lat: avgLat, lng: avgLng };
  }, [places]);

  const handleMarkerClick = useCallback(
    (placeId: string) => {
      onSelectPlace(placeId);
    },
    [onSelectPlace]
  );

  const handlePizzaNowAgain = () => {
    runSearch(centerRef.current);
  };

  if (!isLoaded) {
    return (
      <div className="map-column">
        <div className="map-wrapper">
          <div className="map-placeholder">Loading map…</div>
        </div>
        <button className="pizza-again-btn" disabled>
          PIZZA NOW
        </button>
      </div>
    );
  }

  return (
    <div className="map-column">
      <div className="map-wrapper">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={14}
          options={{
            disableDefaultUI: true,
            clickableIcons: false,
            styles: [
              { elementType: "geometry", stylers: [{ color: "#050816" }] },
              {
                elementType: "labels.text.fill",
                stylers: [{ color: "#ffffff" }],
              },
              {
                elementType: "labels.text.stroke",
                stylers: [{ color: "#050816" }],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#111827" }],
              },
              {
                featureType: "road",
                elementType: "labels",
                stylers: [{ visibility: "simplified" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#0f172a" }],
              },
              { featureType: "poi", stylers: [{ visibility: "off" }] },
              {
                featureType: "poi.business",
                stylers: [{ visibility: "off" }],
              },
              {
                featureType: "transit",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        >
          {places.map((place) => (
            <Marker
              key={place.id}
              position={{ lat: place.lat, lng: place.lng }}
              onClick={() => handleMarkerClick(place.id)}
              icon={{
                url: "/pizza.png",
                scaledSize: new window.google.maps.Size(36, 36),
                anchor: new window.google.maps.Point(18, 36),
              }}
              title={place.name}
            />
          ))}
        </GoogleMap>
      </div>

      <button
        className="pizza-again-btn"
        onClick={handlePizzaNowAgain}
      >
        PIZZA NOW
      </button>
    </div>
  );
};
