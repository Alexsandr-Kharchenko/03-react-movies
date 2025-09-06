import styles from './MovieGrid.module.css';
import type { Movie } from '../../types/movie';
import { imageUrl } from '../../services/movieService';

export interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

// default export, щоб імпорт у App.tsx працював
export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  if (!movies.length) return null;

  return (
    <ul className={styles.grid}>
      {movies.map(movie => {
        const src = imageUrl(movie.poster_path, 'w500');
        return (
          <li key={movie.id}>
            <div
              className={styles.card}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(movie)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') onSelect(movie);
              }}
            >
              {src ? (
                <img
                  className={styles.image}
                  src={src}
                  alt={movie.title}
                  loading="lazy"
                />
              ) : (
                <div className={styles.image} aria-hidden="true" />
              )}
              <h2 className={styles.title}>{movie.title}</h2>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
