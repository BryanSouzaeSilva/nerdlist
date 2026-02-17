import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { MediaItem } from '../shared/interfaces/media-item.interface';

interface TmdbMovie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
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
      title: item.title,
      slug: this.slugify(item.title),
      posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      backdropUrl: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
      releaseDate: item.release_date,
      genres: [],
      status: 'RELEASED',
      rating: item.vote_average,
      extent: { value: 0, unit: 'MINUTES' },
    }));

    return movies;
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

  findOne(id: number) {
    return `This action returns a #${id} movie`;
  }
}
