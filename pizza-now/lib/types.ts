export interface PlaceReview {
  authorName?: string;
  rating?: number;
  text?: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;           // Google rating
  distanceMeters: number;   // from user / search center
  reviews?: PlaceReview[];  // top few reviews
  photoUrl?: string;
  phoneNumber?: string;
  website?: string;
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
  rating?: number;
  note?: string;
}

export interface UserData {
  ratings: UserRating[];
  visits: Visit[];
}
