import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './MovieModal.module.css';
import type { Movie } from '../../types/movie';
import { imageUrl } from '../../services/movieService';

export interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const modalRoot = document.getElementById('modal-root') as HTMLElement;

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    if (!movie) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // Блокуємо скрол тіла
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [movie, onClose]);

  if (!movie) return null;

  const backdrop = imageUrl(movie.backdrop_path, 'original');

  const content = (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>

        {backdrop && (
          <img src={backdrop} alt={movie.title} className={styles.image} />
        )}

        <div className={styles.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview || 'No overview available.'}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date || '—'}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average ?? '—'}/10
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(content, modalRoot);
}
