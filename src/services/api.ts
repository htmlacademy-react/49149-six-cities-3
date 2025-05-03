import { createApi } from '@reduxjs/toolkit/query/react';

import { AuthCredentials, Comment, Place, User } from '../types';
import axiosBaseQuery from './axiosBaseQuery';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  keepUnusedDataFor: 30,
  tagTypes: ['Offers', 'Favorite', 'Auth', 'Comments', 'Nearby-Offers'],
  endpoints: (builder) => ({
    getOffers: builder.query<Place[], void>({
      query: () => ({ url: '/offers', method: 'GET' }),
      keepUnusedDataFor: 0,
      providesTags: ['Offers'],
    }),
    getFavorite: builder.query<Place[], void>({
      query: () => ({ url: '/favorite', method: 'GET' }),
      providesTags: ['Favorite'],
    }),
    getLogin: builder.query<User, void>({
      query: () => ({ url: '/login', method: 'GET' }),
      providesTags: ['Auth'],
    }),
    loginUser: builder.mutation<User, AuthCredentials>({
      query: (credentials: AuthCredentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'DELETE',
      }),
    }),
    getOfferComments: builder.query<Comment[], string>({
      query: (offerId) => ({ url: `/comments/${offerId}`, method: 'GET' }),
      providesTags: (offerId) => [{ type: 'Comments', offerId }],
    }),
    getNearbyOffers: builder.query<Place[], string>({
      query: (offerId) => ({ url: `/offers/${offerId}/nearby`, method: 'GET' }),
      providesTags: (offerId) => [{ type: 'Nearby-Offers', offerId }],
    }),
    addComment: builder.mutation<Comment, { rating: number; comment: string } & { offerId?: string }>({
      query: ({ comment, rating, offerId }) => ({
        url: `/comments/${offerId}`,
        method: 'POST',
        body: {
          comment,
          rating: Number(rating),
        },
      }),
      invalidatesTags: ['Comments'],
    }),
    toggleFavorite: builder.mutation<Place, { status: 0 | 1; favorite: Place; offerId: string } & { offerId?: string }>({
      query: ({ favorite, status, offerId }) => ({
        url: `/favorite/${offerId}/${status}`,
        method: 'POST',
        body: {
          favorite,
        },
      }),
      invalidatesTags: ['Favorite'],
    }),
  }),
});

export const {
  useGetOffersQuery,
  useGetFavoriteQuery,
  useGetLoginQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetOfferCommentsQuery,
  useAddCommentMutation,
  useGetNearbyOffersQuery,
  useToggleFavoriteMutation,
} = api;
