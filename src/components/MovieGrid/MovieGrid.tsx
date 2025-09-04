import styles from './MovieGrid.module.css';
import type { Movie } from '../../types/movie';
import { imageUrl } from '../../services/movieService';

export interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  if (!movies.length) return null;

  return (
    <ul className={styles.grid}>
      {movies.map(m => {
        const src = imageUrl(m.poster_path, 'w500');
        return (
          <li key={m.id}>
            <div
              className={styles.card}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(m)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') onSelect(m);
              }}
            >
              {src ? (
                <img
                  className={styles.image}
                  src={src}
                  alt={m.title}
                  loading="lazy"
                />
              ) : (
                <div className={styles.image} aria-hidden="true" />
              )}
              <h2 className={styles.title}>{m.title}</h2>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
