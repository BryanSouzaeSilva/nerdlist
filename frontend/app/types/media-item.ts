export interface MediaItem {
    id: number;
    source: 'TMDB' | 'RAWG' | 'ANILIST';
    slug: string;
    title: string;
    posterUrl: string;
    backgroundUrl?: string;
    type: 'MOVIE' | 'GAME' | 'ANIME' | 'MANGA' | 'SERIES';
    releaseDate: string;
    genres: string[];
    status: 'RELEASED' | 'ONGOING' | 'UPGOING' | 'HIATUS' | 'CANCELED';
    extend?: {
        value: number;
        unit: 'MINUTES' | 'EPISODES' | 'CHAPTERS' | 'HOURS';
    };
    rating?: number;
}