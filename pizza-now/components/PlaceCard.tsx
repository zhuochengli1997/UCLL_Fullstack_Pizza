import { Place } from "@/lib/types";

interface PlaceCardProps {
  place: Place | null;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  if (!place) {
    return (
      <div className="place-card">
        <p>Select a pizza place from the map or press PIZZA NOW.</p>
      </div>
    );
  }

  const distanceText =
    place.distanceMeters && place.distanceMeters > 0
      ? `${(place.distanceMeters / 1000).toFixed(2)} km away`
      : null;

  const firstReview = place.reviews && place.reviews[0];

  return (
    <div className="place-card">
      <div className="place-card-grid">
        {/* Top-left: Photo */}
        <div className="place-photo">
          {place.photoUrl ? (
            <img
              src={place.photoUrl}
              alt={place.name}
            />
          ) : (
            <div className="place-photo-fallback">
              <span role="img" aria-label="pizza">
                🍕
              </span>
              <p>No photo</p>
            </div>
          )}
        </div>

        {/* Top-right: Info */}
        <div className="place-info">
          <h2 className="place-title">{place.name}</h2>

          {distanceText && (
            <div className="place-info-line">
              <span className="label">Distance</span>
              <span>{distanceText}</span>
            </div>
          )}

          <div className="place-info-line">
            <span className="label">Google Rating</span>
            <span>
              {place.rating
                ? `⭐ ${place.rating.toFixed(1)}`
                : "No rating"}
            </span>
          </div>

          <div className="place-info-line">
            <span className="label">Address</span>
            <span>{place.address}</span>
          </div>

          {place.phoneNumber && (
            <div className="place-info-line">
              <span className="label">Phone</span>
              <span>{place.phoneNumber}</span>
            </div>
          )}

          {place.website && (
            <div className="place-info-line">
              <span className="label">Website</span>
              <a
                href={place.website}
                target="_blank"
                rel="noreferrer"
                className="place-link"
              >
                Visit site
              </a>
            </div>
          )}

          {firstReview && (
            <div className="place-highlight">
              <span className="label">Vibe</span>
              <span>
                {firstReview.text &&
                firstReview.text.length > 80
                  ? firstReview.text.slice(0, 80) + "..."
                  : firstReview.text}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Reviews */}
      <div className="place-reviews-block">
        <h4>Recent reviews</h4>
        {place.reviews && place.reviews.length > 0 ? (
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
                    {rev.text.length > 220
                      ? rev.text.slice(0, 220) + "..."
                      : rev.text}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-reviews">No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export { PlaceCard };
