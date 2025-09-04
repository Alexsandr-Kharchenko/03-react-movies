import { useCallback, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import SearchBar from './components/SearchBar/SearchBar';
import MovieGrid from './components/MovieGrid/MovieGrid';
import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import { fetchMovies } from './services/movieService';
import type { Movie } from './types/movie';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Movie | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    setError(null);
    setMovies([]); // очищення попереднього пошуку
    setLoading(true);

    try {
      const data = await fetchMovies({ query, page: 1 });
      if (!data.results.length) {
        toast.error('No movies found for your request.');
      }
      setMovies(data.results);
    } catch (err) {
      console.error(err);
      setError('fetch_error');
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      {loading && <Loader />}
      {!loading && error && <ErrorMessage />}
      {!loading && !error && (
        <MovieGrid movies={movies} onSelect={m => setSelected(m)} />
      )}

      {/* Модалка підключається тут, але компонент створює портал сам */}
      {/* Щоб прибрати вибраний фільм після закриття, передаємо onClose */}
      {selected && (
        <div style={{ display: 'contents' }}>
          {/* Ледачий імпорт не потрібен, бо застосунок невеликий */}
          {/*
            В окремий компонент винесено логіку й портал.
            Тут важливо НІЧОГО не ламати в дереві, тому wrapper = display: contents
          */}
        </div>
      )}
      {/* Безпосередньо імпортуємо MovieModal, щоб TS знав типи */}
      {/* І рендеримо його умовно внизу: */}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <MovieModalContainer movie={selected} onClose={() => setSelected(null)} />
    </>
  );
}

// Окремий контейнер, щоб уникнути умовного імпорту зверху та мати чистий App
import MovieModal from './components/MovieModal/MovieModal';
interface MovieModalContainerProps {
  movie: Movie | null;
  onClose: () => void;
}
function MovieModalContainer({ movie, onClose }: MovieModalContainerProps) {
  return <MovieModal movie={movie} onClose={onClose} />;
}
