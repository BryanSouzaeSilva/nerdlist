export interface MediaItem {
  id: string | number;
  source: 'TMDB' | 'RAWG' | 'ANILIST' | 'JIKAN';
  slug: string;
  title: string;
  posterUrl: string;
  backdropUrl?: string;
  type: 'MOVIE' | 'GAME' | 'ANIME' | 'MANGA' | 'SERIES';
  releaseDate: string;
  genres: string[];
  status: 'RELEASED' | 'ONGOING' | 'UPGOING' | 'HIATUS' | 'CANCELED';
  extend?: {
    value: number;
    unit: 'MINUTES' | 'EPISODES' | 'CHAPTERS' | 'HOURS';
  };
  rating?: number;
  synopsis?: string;
  trailerUrl?: string;
  cast?: {
    id: number;
    name: string;
    character: string;
    profileUrl: string;
  }[];
}
