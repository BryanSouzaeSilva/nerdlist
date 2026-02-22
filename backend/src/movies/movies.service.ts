import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { MediaItem } from '../shared/interfaces/media-item.interface';

interface TmdbMovie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
}

interface TmdbResponse {
  results: TmdbMovie[];
}

@Injectable()
export class MoviesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<MediaItem[]> {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    const apiUrl = this.configService.get<string>('TMDB_API_URL');

    const { data } = await firstValueFrom(
      this.httpService.get<TmdbResponse>(`${apiUrl}/movie/popular`, {
        params: {
          api_key: apiKey,
          language: 'pt-BR',
        },
      }),
    );

    const movies: MediaItem[] = data.results.map((item) => ({
      id: item.id,
      source: 'TMDB',
      type: 'MOVIE',
      title: item.title || item.name || 'Título Desconecido',
      slug: this.slugify(item.title || item.name || 'title'),
      posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      backdropUrl: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
      releaseDate: item.release_date,
      genres: [],
      status: 'RELEASED',
      rating: item.vote_average,
      extent: { value: 0, unit: 'MINUTES' },
      synopsis: item.overview,
    }));

    return movies;
  }

  async findAllSeries(): Promise<MediaItem[]> {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    const apiUrl = this.configService.get<string>('TMDB_API_URL');

    const { data } = await firstValueFrom(
      this.httpService.get<TmdbResponse>(`${apiUrl}/tv/popular`, {
        params: {
          api_key: apiKey,
          language: 'pt-BR',
        },
      }),
    );

    return data.results.map((item) => ({
      id: item.id,
      source: 'TMDB',
      type: 'SERIES',
      title: item.title || item.name || 'Título Desconecido',
      slug: this.slugify(item.name || 'title'),
      posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      backdropUrl: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
      releaseDate: item.first_air_date || '',
      genres: [],
      status: 'RELEASED',
      rating: item.vote_average,
      extent: { value: 0, unit: 'EPISODES' },
      synopsis: item.overview,
    }));
  }

  async findOne(id: number, type: string): Promise<MediaItem> {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    const apiUrl = this.configService.get<string>('TMDB_API_URL');

    const resourceType = type === 'SERIES' ? 'tv' : 'movie';

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<TmdbMovie>(`${apiUrl}/${resourceType}/${id}`, {
          params: {
            api_key: apiKey,
            language: 'pt-BR',
          },
        }),
      );

      return {
        id: data.id,
        source: 'TMDB',
        type: type === 'SERIES' ? 'SERIES' : 'MOVIE',
        title: data.title || data.name || 'Título Desconecido',
        slug: this.slugify(data.title || data.name || 'title'),
        posterUrl: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
        backdropUrl: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
        releaseDate: data.release_date || data.first_air_date || '',
        genres: [],
        status: 'RELEASED',
        rating: data.vote_average,
        extent: { value: 0, unit: type === 'SERIES' ? 'EPISODES' : 'MINUTES' },
        synopsis: data.overview,
      };
    } catch {
      throw new NotFoundException(
        `Item com ID ${id} e tipo ${type} não encontrado`,
      );
    }
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
}
