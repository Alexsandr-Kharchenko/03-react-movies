import axios from 'axios';
import type { FetchMoviesResponse, MovieDetails } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// Пошук фільмів за запитом
export async function fetchMovies(query: string): Promise<FetchMoviesResponse> {
  const { data } = await api.get<FetchMoviesResponse>(
    `/search/movie?query=${encodeURIComponent(query)}`
  );
  return data;
}

// Трендові фільми дня
export async function fetchTrending(): Promise<FetchMoviesResponse> {
  const { data } = await api.get<FetchMoviesResponse>(`/trending/movie/day`);
  return data;
}

// Деталі конкретного фільму
export async function fetchMovieDetails(
  movieId: number
): Promise<MovieDetails> {
  const { data } = await api.get<MovieDetails>(`/movie/${movieId}`);
  return data;
}

// URL постера чи бекдропу
export function imageUrl(
  path: string | null,
  size: 'w200' | 'w500' | 'original' = 'w200'
): string | null {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}
