// services/axiosAdapter.ts
import axios, { AxiosError, AxiosResponse } from 'axios';

import { HttpMethod } from '../types';
import { API_URL, REQUEST_TIMEOUT } from '../var.env';
import { getToken } from './token';

// Общая настройка Axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: Number(REQUEST_TIMEOUT),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Транспортный слой поверх Axios
const axiosBaseQuery = () => async (args: { url: string; method: HttpMethod; body?: Record<string, unknown>; params?: Record<string, unknown>; signal?: AbortSignal }) => {
  try {
    // Заголовки
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    // Добавляем токен, если он есть
    const token = getToken();
    if (token) {
      headers['X-Token'] = token;
    }

    const result: AxiosResponse = await axiosInstance.request({
      url: args.url,
      method: args.method,
      data: args.body,
      params: args.params,
      signal: args.signal,
      headers,
    });

    return { data: result.data as Record<string, unknown> };
  } catch (axiosError) {
    const err = axiosError as AxiosError;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};

export default axiosBaseQuery;
