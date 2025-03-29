export type Coordinates = {
  lat: number;
  lng: number;
};

export type Place = {
  id: number;
  city: string;
  name: string;
  poster: string;
  price: number;
  rating: string;
  type: string;
  isPremium?: boolean;
  coordinates: Coordinates;
};

export type StarRating = {
  value: string;
  title: string;
};

export type ReviewFormData = {
  rating: string;
  review: string;
};

export type City = {
  name: string;
  center: Coordinates;
  zoom: number;
};
