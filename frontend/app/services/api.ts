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