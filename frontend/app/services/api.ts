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
            throw new Error("Falha ao buscar detalhes");
        }

        return response.json();
    } catch (error) {
        console.error(error);
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

export async function searchMedia(query: string, type?: string): Promise<MediaItem[]> {
    try {
        const typeParam = type && type !== 'ALL' ? `&type=${type}` : '';
        const response = await fetch(`${API_URL}/movies/search?q=${query}${typeParam}`, { cache: 'no-store' });
        
        if (!response.ok) throw new Error("Falha ao buscar");
        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getAnimes(): Promise<MediaItem[]> {
    try {
        const response = await fetch(`${API_URL}/movies/animes`, { cache: 'no-store' });
        
        if (!response.ok) {
            console.warn("API de animes retornou erro, devolvendo lista vazia.");
            return [];
        }
        
        return response.json();
    } catch (error) {
        console.error("Erro de conexão ao buscar animes:", error);
        return [];
    }
}

export async function getMangas(): Promise<MediaItem[]> {
    try {
        const response = await fetch(`${API_URL}/movies/mangas`, { cache: 'no-store' });
        if (!response.ok) throw new Error("Falha ao buscar mangás");
        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}