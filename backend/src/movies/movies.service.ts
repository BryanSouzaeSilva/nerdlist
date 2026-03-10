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
  genres?: { id: number; name: string }[];
  runtime?: number;
  number_of_episodes?: number;
}

interface TmdbResponse {
  results: TmdbMovie[];
}

interface RawgGame {
  id: number;
  name: string;
  background_image: string;
  background_image_additional?: string;
  released: string;
  rating: number;
  playtime: number;
  description_raw?: string;
  description?: string;
  genres?: { id: number; name: string }[];
}

interface RawgResponse {
  results: RawgGame[];
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
      title: item.title || item.name || 'Título Desconhecido',
      slug: this.slugify(item.title || item.name || 'title'),
      posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      backdropUrl: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
      releaseDate: item.release_date,
      genres: [],
      status: 'RELEASED',
      rating: item.vote_average,
      extend: { value: 0, unit: 'MINUTES' },
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
      title: item.title || item.name || 'Título Desconhecido',
      slug: this.slugify(item.name || 'title'),
      posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      backdropUrl: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
      releaseDate: item.first_air_date || '',
      genres: [],
      status: 'RELEASED',
      rating: item.vote_average,
      extend: { value: 0, unit: 'EPISODES' },
      synopsis: item.overview,
    }));
  }

  async findAllGames(): Promise<MediaItem[]> {
    const apiKey = this.configService.get<string>('RAWG_API_KEY');
    const apiUrl = this.configService.get<string>('RAWG_API_URL');

    const { data } = await firstValueFrom(
      this.httpService.get<RawgResponse>(`${apiUrl}/games`, {
        params: {
          key: apiKey,
          ordering: '-added',
          page_size: 20,
        },
      }),
    );

    return data.results.map((item) => ({
      id: item.id,
      source: 'RAWG',
      type: 'GAME',
      title: item.name || 'Título Desconecido',
      slug: this.slugify(item.name || 'title'),
      posterUrl: item.background_image || '',
      backdropUrl: item.background_image || '',
      releaseDate: item.released || '',
      genres: item.genres
        ? item.genres.map((g: { id: number; name: string }) => g.name)
        : [],
      status: 'RELEASED',
      rating: item.rating ? item.rating * 2 : 0,
      extend: { value: item.playtime || 0, unit: 'HOURS' },
      synopsis: 'Sinopse completa disponível na página de detalhes',
    }));
  }

  async findOne(id: number, type: string): Promise<MediaItem> {
    if (type === 'GAME') {
      const apiKey = this.configService.get<string>('RAWG_API_KEY');
      const apiUrl = this.configService.get<string>('RAWG_API_URL');

      try {
        const { data } = await firstValueFrom(
          this.httpService.get<RawgGame>(`${apiUrl}/games/${id}`, {
            params: { key: apiKey },
          }),
        );

        return {
          id: data.id,
          source: 'RAWG',
          type: 'GAME',
          title: data.name || 'Título Desconhecido',
          slug: this.slugify(data.name || 'title'),
          posterUrl: data.background_image || '',
          backdropUrl:
            data.background_image_additional || data.background_image || '',
          releaseDate: data.released || '',
          genres: data.genres
            ? data.genres.map((g: { id: number; name: string }) => g.name)
            : [],
          status: 'RELEASED',
          rating: data.rating ? data.rating * 2 : 0,
          extend: { value: data.playtime || 0, unit: 'HOURS' },
          synopsis:
            data.description_raw ||
            data.description ||
            'Sinopse não disponível.',
        };
      } catch {
        throw new NotFoundException(`Jogo com ID ${id} não encontrado`);
      }
    }

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
        title: data.title || data.name || 'Título Desconhecido',
        slug: this.slugify(data.title || data.name || 'title'),
        posterUrl: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
        backdropUrl: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
        releaseDate: data.release_date || data.first_air_date || '',
        genres: data.genres
          ? data.genres.map((g: { id: number; name: string }) => g.name)
          : [],
        status: 'RELEASED',
        rating: data.vote_average,
        extend: {
          value:
            type === 'SERIES'
              ? data.number_of_episodes || 0
              : data.runtime || 0,
          unit: type === 'SERIES' ? 'EPISODES' : 'MINUTES',
        },
        synopsis: data.overview,
      };
    } catch {
      throw new NotFoundException(
        `Item com ID ${id} e tipo ${type} não encontrado`,
      );
    }
  }

  async findTopRated(): Promise<MediaItem[]> {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    const apiUrl = this.configService.get<string>('TMDB_API_URL');

    const { data } = await firstValueFrom(
      this.httpService.get<TmdbResponse>(`${apiUrl}/movie/top_rated`, {
        params: { api_key: apiKey, language: 'pt-BR' },
      }),
    );

    return data.results.map((item) => ({
      id: item.id,
      source: 'TMDB',
      type: 'MOVIE',
      title: item.title || item.name || 'Título Desconhecido',
      slug: this.slugify(item.title || item.name || 'title'),
      posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      backdropUrl: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
      releaseDate: item.release_date || '',
      genres: [],
      status: 'RELEASED',
      rating: item.vote_average,
      extend: { value: 0, unit: 'MINUTES' },
      synopsis: item.overview,
    }));
  }

  async findUpComing(): Promise<MediaItem[]> {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    const apiUrl = this.configService.get<string>('TMDB_API_URL');

    const { data } = await firstValueFrom(
      this.httpService.get<TmdbResponse>(`${apiUrl}/movie/upcoming`, {
        params: { api_key: apiKey, language: 'pt-BR' },
      }),
    );

    return data.results.map((item) => ({
      id: item.id,
      source: 'TMDB',
      type: 'MOVIE',
      title: item.title || item.name || 'Título Desconhecido',
      slug: this.slugify(item.title || item.name || 'title'),
      posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      backdropUrl: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
      releaseDate: item.release_date || '',
      genres: [],
      status: 'RELEASED',
      rating: item.vote_average,
      extend: { value: 0, unit: 'MINUTES' },
      synopsis: item.overview,
    }));
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
