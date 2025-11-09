import { Place, UserData } from "@/lib/types";

interface UserCardProps {
  places: Place[];
  userData: UserData;
  selectedPlaceId: string | null;
}

const UserCard: React.FC<UserCardProps> = ({
  places,
  userData,
  selectedPlaceId,
}) => {
  const getPlaceName = (id: string) =>
    places.find((p) => p.id === id)?.name || "Unknown place";

  const visitsSorted = [...userData.visits].sort(
    (a, b) =>
      new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime()
  );

  const selectedRating = selectedPlaceId
    ? userData.ratings.find((r) => r.placeId === selectedPlaceId)
    : null;

  return (
    <div className="user-card">
      <h3>Your pizza trail</h3>

      {selectedRating && (
        <div className="selected-place-rating">
          <strong>{getPlaceName(selectedRating.placeId)}</strong>
          <div>⭐ {selectedRating.rating}</div>
          {selectedRating.note && <p>{selectedRating.note}</p>}
        </div>
      )}

      <div className="visit-history">
        <h4>Recent visits</h4>
        {visitsSorted.length === 0 ? (
          <p>No visits yet. Rate a place after you try it.</p>
        ) : (
          <ul>
            {visitsSorted.slice(0, 5).map((v, i) => (
              <li key={i}>
                {getPlaceName(v.placeId)} —{" "}
                {new Date(v.visitedAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export { UserCard };
