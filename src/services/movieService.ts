import axios, { type AxiosResponse } from 'axios';

import type { Movie } from '../types/movie';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface FetchMoviesParams {
  query: string;
  page?: number;
}

export interface FetchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

/**
 * Пошук фільмів за ключовим словом.
 * Токен береться з process.env.VITE_TMDB_TOKEN (Vite: import.meta.env).
 */
export async function fetchMovies({
  query,
  page = 1,
}: FetchMoviesParams): Promise<FetchMoviesResponse> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }

  const token = import.meta.env.VITE_TMDB_TOKEN as string | undefined;
  if (!token) {
    throw new Error(
      'TMDB token is missing. Please set VITE_TMDB_TOKEN in your environment.'
    );
  }

  const config = {
    params: {
      query,
      include_adult: false,
      language: 'en-US',
      page,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } as const;

  const resp: AxiosResponse<FetchMoviesResponse> = await axios.get(
    `${TMDB_BASE_URL}/search/movie`,
    config
  );

  return resp.data;
}

/** Хелпер для побудови повної URL до зображення */
export function imageUrl(
  path: string | null,
  size: 'w500' | 'original' = 'w500'
): string | undefined {
  if (!path) return undefined;
  const base = 'https://image.tmdb.org/t/p/';
  return `${base}${size}${path}`;
}
