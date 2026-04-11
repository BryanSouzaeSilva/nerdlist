import { MediaItem } from '../types/media-item';

const API_URL = 'https://nerdlist.onrender.com';

export async function getMovies(): Promise<MediaItem[]> {
    try {
        const response = await fetch(`${API_URL}/movies`, { next: { revalidate: 3600 } });

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
        const response = await fetch(`${API_URL}/movies/series`, { next: { revalidate: 3600 } });

        if (!response.ok) {
            throw new Error("Falha ao buscar as séries");
        }

        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const getMovieById = async (id: string, type: string, source?: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://nerdlist.onrender.com';
    
    let url = `${baseUrl}/movies/${id}?type=${type}`;
    if (source) {
        url += `&source=${source}`;
    }

    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) {
        throw new Error("Falha ao buscar detalhes");
    }
    return response.json();
};

export async function getTopRatedMovies(): Promise<MediaItem[]> {
    try {
        const response = await fetch(`${API_URL}/movies/top-rated`, { next: { revalidate: 3600 } });
        if( !response.ok ) throw new Error("Falha ao buscar top rated");
        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getUpComingMovies(): Promise<MediaItem[]> {
    try {
        const response = await fetch(`${API_URL}/movies/upcoming`, { next: { revalidate: 3600 } });
        if( !response.ok ) throw new Error("Falha ao buscar lançamentos");
        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getGames(): Promise<MediaItem[]> {
    try {
        const response = await fetch(`${API_URL}/movies/games`, { next: { revalidate: 3600 } });
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
        const response = await fetch(`${API_URL}/movies/search?q=${query}${typeParam}`, { next: { revalidate: 3600 } });
        
        if (!response.ok) throw new Error("Falha ao buscar");
        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getAnimes(): Promise<MediaItem[]> {
    try {
        const response = await fetch(`${API_URL}/movies/animes`, { next: { revalidate: 3600 } });
        
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
        const response = await fetch(`${API_URL}/movies/mangas`, { next: { revalidate: 3600 } });
        if (!response.ok) throw new Error("Falha ao buscar mangás");
        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}