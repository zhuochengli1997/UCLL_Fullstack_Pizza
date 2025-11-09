export interface Place {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  distanceMeters: number;
}

export interface UserRating {
  placeId: string;
  rating: number;
  note?: string;
  updatedAt: string;
}

export interface Visit {
  placeId: string;
  visitedAt: string;
}

export interface UserData {
  ratings: UserRating[];
  visits: Visit[];
}
