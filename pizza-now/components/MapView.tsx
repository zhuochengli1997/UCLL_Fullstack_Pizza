import { Place } from "@/lib/types";

interface MapViewProps {
  places: Place[];
  selectedPlaceId: string | null;
  onSelectPlace: (placeId: string) => void;
}

const MapView: React.FC<MapViewProps> = ({
  places,
  selectedPlaceId,
  onSelectPlace,
}) => {
  return (
    <div className="map-view">
      <div className="map-placeholder">
        Map goes here (Google Maps / Leaflet later)
      </div>

      <ul className="place-list">
        {places.map((place) => (
          <li
            key={place.id}
            className={
              "place-list-item" +
              (place.id === selectedPlaceId ? " place-list-item--active" : "")
            }
            onClick={() => onSelectPlace(place.id)}
          >
            <div className="place-name">{place.name}</div>
            <div className="place-meta">
              ⭐ {place.rating.toFixed(1)} ·{" "}
              {(place.distanceMeters / 1000).toFixed(1)} km
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { MapView };
