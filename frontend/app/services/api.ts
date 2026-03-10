import { MediaItem } from '../types/media-item';

const API_URL = 'http://localhost:3001';

export async function getMovies(): Promise<MediaItem[]> {
    try {
        const response = await fetch(`${API_URL}/movies`, { cache: 'no-store'});

        if (!response.ok) {
            throw new Error("Falha ao buscar os filmes");
        }

        return response.json();
    } catch (error) {
        console.error(error);
        return[];
    }
}

export async function getSeries(): Promise<MediaItem[]> {
    try {
        const response = await fetch(`${API_URL}/movies/series`, { cache: 'no-store' });

        if (!response.ok) {
            throw new Error("Falha ao buscar as séries");
        }

        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getMovieById(id: string, type: string): Promise<MediaItem> {
    try {
        const response = await fetch(`${API_URL}/movies/${id}?type=${type}`, { cache: 'no-store' });

        if (!response.ok) {
            throw new Error("Falha ao buscar detalhes do filme");
        }

        return response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getTopRatedMovies(): Promise<MediaItem[]> {
    try {
        const response = await fetch(`${API_URL}/movies/top-rated`, { cache: 'no-store' });
        if( !response.ok ) throw new Error("Falha ao buscar top rated");
        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getUpComingMovies(): Promise<MediaItem[]> {
    try {
        const response = await fetch(`${API_URL}/movies/upcoming`, { cache: 'no-store' });
        if( !response.ok ) throw new Error("Falha ao buscar lançamentos");
        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getGames(): Promise<MediaItem[]> {
    try {
        const response = await fetch(`${API_URL}/movies/games`, { cache: 'no-store' });
        if (!response.ok) throw new Error("Falha ao buscar jogos");
        return response.json();
    } catch (error){
        console.error(error);
        return [];
    }
}