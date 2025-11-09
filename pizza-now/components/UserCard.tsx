import { Place, UserData } from "@/lib/types";
import { useEffect, useState } from "react";

interface UserCardProps {
  places: Place[];
  userData: UserData;
  selectedPlaceId: string | null;
  onRate?: (placeId: string, rating: number, note?: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  places,
  userData,
  selectedPlaceId,
  onRate,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");

  const selectedPlace = places.find((p) => p.id === selectedPlaceId);

  // When you switch to a different place, prefill with its latest rating (if any)
  useEffect(() => {
    if (!selectedPlaceId) {
      setRating(0);
      setComment("");
      return;
    }

    const existing = userData.ratings.find(
      (r) => r.placeId === selectedPlaceId
    );

    if (existing) {
      setRating(existing.rating);
      setComment(existing.note || "");
    } else {
      setRating(0);
      setComment("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlaceId]); // note: NOT watching userData, so we don't override manual clears

  const handleSubmit = () => {
    if (!selectedPlaceId || !onRate || !rating) return;
    onRate(selectedPlaceId, rating, comment);

    // Clear inputs after submit
    setRating(0);
    setComment("");
  };

  return (
    <div className="user-card">
      <div className="user-card-grid">
        {/* LEFT: rating & comment */}
        <div className="user-rate-panel">
          <h3>Your rating</h3>

          {selectedPlace ? (
            <>
              <p className="user-place-name">{selectedPlace.name}</p>

              <div className="star-row">
                {[1, 2, 3, 4, 5].map((num) => (
                  <span
                    key={num}
                    className={`star ${rating >= num ? "active" : ""}`}
                    onClick={() => setRating(num)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                className="comment-box"
                placeholder="Add a short comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                className="save-btn"
                onClick={handleSubmit}
                disabled={!rating}
              >
                Submit
              </button>
            </>
          ) : (
            <p>Select a pizza place to rate.</p>
          )}
        </div>

        {/* RIGHT: visit history (using visit snapshots) */}
        <div className="user-history-panel">
          <h3>Visit history</h3>
          {userData.visits && userData.visits.length > 0 ? (
            <ul className="history-list">
              {userData.visits
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.visitedAt).getTime() -
                    new Date(a.visitedAt).getTime()
                )
                .map((v, i) => {
                  const place = places.find((p) => p.id === v.placeId);
                  if (!place) return null;

                  const date = new Date(v.visitedAt).toLocaleDateString();

                  return (
                    <li key={i} className="history-item">
                      <div className="history-row">
                        <span className="history-name">
                          {place.name}
                        </span>
                        <span className="history-date">
                          {date}
                        </span>
                      </div>
                      {(v.rating !== undefined || v.note) && (
                        <div className="history-rating">
                          {v.rating !== undefined && (
                            <>⭐ {v.rating}</>
                          )}
                          {v.note && (
                            <span className="history-note">
                              {v.rating !== undefined ? " — " : ""}
                              {v.note}
                            </span>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
            </ul>
          ) : (
            <p className="no-history">No visits yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export { UserCard };
