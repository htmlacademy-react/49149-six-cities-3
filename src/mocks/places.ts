import { Place } from '../types';

export const PLACES: Place[] = [
  {
    id: 1,
    city: 'Amsterdam',
    name: 'Beautiful &amp; luxurious apartment at great location',
    price: 80,
    rating: '80%',
    type: 'Room',
    isPremium: true,
    poster: 'img/apartment-01.jpg',
    coordinates: {
      lat: 52.3909553943508,
      lng: 4.85309666406198,
    },
  },
  {
    id: 2,
    city: 'Amsterdam',
    name: 'Canal View Prinsengracht',
    price: 132,
    rating: '80%',
    type: 'Apartment',
    isPremium: false,
    poster: 'img/apartment-02.jpg',
    coordinates: {
      lat: 52.3609553943508,
      lng: 4.85309666406198,
    },
  },
  {
    id: 3,
    city: 'Amsterdam',
    name: 'Nice, cozy, warm big bed apartment',
    price: 180,
    rating: '100%',
    type: 'Apartment',
    isPremium: true,
    poster: 'img/apartment-03.jpg',
    coordinates: {
      lat: 52.3909553943508,
      lng: 4.929309666406198,
    },
  },
  {
    id: 4,
    city: 'Amsterdam',
    name: 'Wood and stone place',
    price: 80,
    rating: '80%',
    type: 'Room',
    isPremium: false,
    poster: 'img/room.jpg',
    coordinates: {
      lat: 52.3809553943508,
      lng: 4.939309666406198,
    },
  },
];
