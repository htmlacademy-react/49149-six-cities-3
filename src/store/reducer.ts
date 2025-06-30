import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Place, User } from '../types';
import { AuthStatus } from '../enums/auth';

const initialState = {
  authorizationStatus: AuthStatus.Unknown,
  user: null as User | null,
  activeCity: '',
  allPlaces: [] as Place[], // Храним все места
  sortedCityPlaces: [] as Place[],
  activePointPlace: {} as Place,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAllPlaces: (state, action: PayloadAction<Place[]>) => {
      state.allPlaces = action.payload;
    },
    setAuthorizationStatus: (state, action: PayloadAction<AuthStatus>) => {
      state.authorizationStatus = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    changeCity: (state, action: PayloadAction<string>) => {
      state.activeCity = action.payload;
      state.sortedCityPlaces = []; // Сбрасываем сортировку при смене города
    },
    setSortedPlaces: (state, action: PayloadAction<Place[]>) => {
      state.sortedCityPlaces = action.payload;
    },
    setActivePointPlace: (state, action: PayloadAction<Place>) => {
      state.activePointPlace = action.payload;
    },
  },
});

export const { changeCity, setAuthorizationStatus, setAllPlaces, setActivePointPlace, setSortedPlaces, setUser } = appSlice.actions;

export default appSlice.reducer;
