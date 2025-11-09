import { useState, useEffect } from "react";
import { Place, UserRating } from "@/lib/types";

interface PlaceCardProps {
  place: Place;
  userRating: UserRating | null;
  onRate: (placeId: string, rating: number, note?: string) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  userRating,
  onRate,
}) => {
  const [tempRating, setTempRating] = useState(userRating?.rating || 0);
  const [note, setNote] = useState(userRating?.note || "");

  // When user switches places, sync local state with new rating
  useEffect(() => {
    setTempRating(userRating?.rating || 0);
    setNote(userRating?.note || "");
  }, [userRating?.rating, userRating?.note, place.id]);

  const submitRating = () => {
    if (!tempRating) return;
    onRate(place.id, tempRating, note || undefined);
  };

  return (
    <div className="place-card">
      <h2>{place.name}</h2>
      <p className="place-address">{place.address}</p>
      <p className="place-public-rating">
        Public rating: ⭐ {place.rating.toFixed(1)}
      </p>
      <p className="place-distance">
        Approx. {(place.distanceMeters / 1000).toFixed(1)} km away
      </p>

      <div className="user-rating-section">
        <div>Your rating</div>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={n <= tempRating ? "star star--active" : "star"}
              onClick={() => setTempRating(n)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Short note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button className="save-rating-btn" onClick={submitRating}>
          Save
        </button>

        {userRating && (
          <p className="last-updated">
            Last updated:{" "}
            {new Date(userRating.updatedAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export { PlaceCard };
