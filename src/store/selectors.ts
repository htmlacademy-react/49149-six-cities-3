import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '.';

const selectUser = (state: RootState) => state.app.user;
const selectActiveCity = (state: RootState) => state.app.activeCity;
const selectAllPlaces = (state: RootState) => state.app.allPlaces;
const selectorSortedCityPlaces = (state: RootState) => state.app.sortedCityPlaces;
const selectActivePointPlace = (state: RootState) => state.app.activePointPlace;
const selectActivePointId = (state: RootState) => state.app.activePointPlace?.id;
const selectAuthorizationStatus = (state: RootState) => state.app.authorizationStatus;
// Основной селектор для фильтрации по городу
const selectorActiveCityPlaces = createSelector([selectAllPlaces, selectActiveCity], (allPlaces, activeCity) => allPlaces.filter((place) => place.city.name.toLowerCase() === activeCity.toLowerCase()));

// Комбинированный селектор для сортировки
const selectorCombinedPlaces = createSelector([selectorSortedCityPlaces, selectorActiveCityPlaces], (sorted, active) => (sorted.length > 0 ? sorted : active));

// Селектор для количества мест
const selectPlacesCount = createSelector([selectorActiveCityPlaces], (places) => places.length);

export {
  selectUser,
  selectActiveCity,
  selectorActiveCityPlaces,
  selectorSortedCityPlaces,
  selectorCombinedPlaces,
  selectPlacesCount,
  selectAuthorizationStatus,
  selectActivePointPlace,
  selectActivePointId,
};
