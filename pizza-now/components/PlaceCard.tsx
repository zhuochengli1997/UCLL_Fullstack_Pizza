import { Place } from "@/lib/types";

interface PlaceCardProps {
  place: Place | null;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  if (!place) {
    return (
      <div className="place-card">
        <p>Select a pizza place from the map.</p>
      </div>
    );
  }

  const distanceKm =
    place.distanceMeters > 0
      ? (place.distanceMeters / 1000).toFixed(2)
      : null;

  return (
    <div className="place-card">
      <h2>{place.name}</h2>
      <p className="place-address">{place.address}</p>

      <p className="place-public-rating">
        Google rating: {place.rating ? `⭐ ${place.rating.toFixed(1)}` : "No rating"}
      </p>

      {distanceKm && (
        <p className="place-distance">
          ~ {distanceKm} km from you
        </p>
      )}

      {place.reviews && place.reviews.length > 0 && (
        <div className="reviews-section">
          <h4>What people say</h4>
          <ul className="reviews-list">
            {place.reviews.map((rev, i) => (
              <li key={i} className="review-item">
                <div className="review-header">
                  <span className="review-author">
                    {rev.authorName || "Anonymous"}
                  </span>
                  {rev.rating && (
                    <span className="review-rating">
                      ⭐ {rev.rating.toFixed(1)}
                    </span>
                  )}
                </div>
                {rev.text && (
                  <p className="review-text">
                    {rev.text.length > 180
                      ? rev.text.slice(0, 180) + "..."
                      : rev.text}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export { PlaceCard };
