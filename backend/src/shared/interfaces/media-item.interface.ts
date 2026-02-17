export interface MediaItem {
  id: string | number;

  source: 'TMDB' | 'RAWG' | 'ANILIST';

  slug: string;

  title: string;

  posterUrl: string;

  backdropUrl?: string;

  type: 'MOVIE' | 'GAME' | 'ANIME' | 'MANGA' | 'SERIES';

  releaseDate: string;

  genres: string[];

  status: 'RELEASED' | 'ONGOING' | 'UPGOING' | 'HIATUS' | 'CANCELED';

  extent?: {
    value: number;
    unit: 'MINUTES' | 'EPISODES' | 'CHAPTERS' | 'HOURS';
  };

  rating?: number;
}
