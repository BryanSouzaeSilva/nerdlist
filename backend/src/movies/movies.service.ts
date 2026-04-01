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

interface JikanItem {
  mal_id: number;
  title: string;
  images: { jpg: { large_image_url: string } };
  synopsis: string;
  score: number;
  aired?: { from: string };
  published?: { from: string };
  episodes?: number;
  chapters?: number;
}

interface JikanResponse {
  data: JikanItem[];
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

  async findAllAnimes(): Promise<MediaItem[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<JikanResponse>('https://api.jikan.moe/v4/top/anime'),
    );

    return data.data.map((item) => ({
      id: item.mal_id,
      source: 'JIKAN' as const,
      type: 'ANIME' as const,
      title: item.title,
      slug: this.slugify(item.title),
      posterUrl: item.images?.jpg?.large_image_url || '',
      backdropUrl: item.images?.jpg?.large_image_url || '',
      releaseDate: item.aired?.from ? item.aired.from.split('T')[0] : '',
      genres: [],
      status: 'RELEASED' as const,
      rating: item.score || 0,
      extend: { value: item.episodes || 0, unit: 'EPISODES' as const },
      synopsis: item.synopsis || 'Sinopse não disponível.',
    }));
  }

  async findAllMangas(): Promise<MediaItem[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<JikanResponse>('https://api.jikan.moe/v4/top/manga'),
    );

    return data.data.map((item) => ({
      id: item.mal_id,
      source: 'JIKAN' as const,
      type: 'MANGA' as const,
      title: item.title,
      slug: this.slugify(item.title),
      posterUrl: item.images?.jpg?.large_image_url || '',
      backdropUrl: item.images?.jpg?.large_image_url || '',
      releaseDate: item.published?.from
        ? item.published.from.split('T')[0]
        : '',
      genres: [],
      status: 'RELEASED' as const,
      rating: item.score || 0,
      extend: { value: item.chapters || 0, unit: 'CHAPTERS' as const },
      synopsis: item.synopsis || 'Sinopse não disponível.',
    }));
  }

  async findOne(id: number, type: string): Promise<MediaItem> {
    const typeUpper = type?.toUpperCase();

    if (typeUpper === 'ANIME' || typeUpper === 'MANGA') {
      const resource = typeUpper === 'ANIME' ? 'anime' : 'manga';
      try {
        const { data } = await firstValueFrom(
          this.httpService.get<{ data: JikanItem }>(
            `https://api.jikan.moe/v4/${resource}/${id}`,
          ),
        );

        const item = data.data;

        let rawDate = '';
        if (typeUpper === 'ANIME') {
          rawDate = item.aired?.from || '';
        } else {
          rawDate = item.published?.from || '';
        }
        const formattedDate = rawDate ? rawDate.split('T')[0] : '';

        return {
          id: item.mal_id,
          source: 'JIKAN',
          type: typeUpper,
          title: item.title,
          slug: this.slugify(item.title),
          posterUrl: item.images?.jpg?.large_image_url || '',
          backdropUrl: item.images?.jpg?.large_image_url || '',
          releaseDate: formattedDate,
          genres: [],
          status: 'RELEASED',
          rating: item.score || 0,
          extend: {
            value:
              typeUpper === 'ANIME' ? item.episodes || 0 : item.chapters || 0,
            unit: typeUpper === 'ANIME' ? 'EPISODES' : 'CHAPTERS',
          },
          synopsis: item.synopsis || 'Sinopse não disponível.',
        };
      } catch {
        throw new NotFoundException(
          `${typeUpper} com ID ${id} não encontrado no Jikan`,
        );
      }
    }

    if (typeUpper === 'GAME') {
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
          genres: Array.isArray(data.genres)
            ? (data.genres as { id: number; name: string }[]).map((g) => g.name)
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
    const resourceType = typeUpper === 'SERIES' ? 'tv' : 'movie';

    try {
      const [detailsResponse, videosResponse, creditsResponse] =
        await Promise.all([
          firstValueFrom(
            this.httpService.get<TmdbMovie>(`${apiUrl}/${resourceType}/${id}`, {
              params: { api_key: apiKey, language: 'pt-BR' },
            }),
          ),
          firstValueFrom(
            this.httpService.get<{
              results: { key: string; site: string; type: string }[];
            }>(`${apiUrl}/${resourceType}/${id}/videos`, {
              params: { api_key: apiKey },
            }),
          ),
          firstValueFrom(
            this.httpService.get<{
              cast: {
                id: number;
                name: string;
                character: string;
                profile_path: string;
              }[];
            }>(`${apiUrl}/${resourceType}/${id}/credits`, {
              params: { api_key: apiKey, language: 'pt-BR' },
            }),
          ),
        ]);

      const data = detailsResponse.data;

      const trailer = videosResponse.data.results.find(
        (v) =>
          v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'),
      );

      const cast = creditsResponse.data.cast.slice(0, 10).map((person) => ({
        id: person.id,
        name: person.name,
        character: person.character,
        profileUrl: person.profile_path
          ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
          : '',
      }));

      return {
        id: data.id,
        source: 'TMDB',
        type: typeUpper === 'SERIES' ? 'SERIES' : 'MOVIE',
        title: data.title || data.name || 'Título Desconhecido',
        slug: this.slugify(data.title || data.name || 'title'),
        posterUrl: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
        backdropUrl: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
        releaseDate: data.release_date || data.first_air_date || '',
        genres: Array.isArray(data.genres)
          ? data.genres.map((g: { name: string }) => g.name)
          : [],
        status: 'RELEASED',
        rating: data.vote_average,
        extend: {
          value:
            typeUpper === 'SERIES'
              ? data.number_of_episodes || 0
              : data.runtime || 0,
          unit: typeUpper === 'SERIES' ? 'EPISODES' : 'MINUTES',
        },
        synopsis: data.overview,
        trailerUrl: trailer ? trailer.key : '',
        cast,
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

  async search(query: string, typeFilter?: string): Promise<MediaItem[]> {
    if (!query) return [];

    let allResults: MediaItem[] = [];
    const isAll = !typeFilter || typeFilter === 'ALL';

    // 1. BUSCA NO TMDB (Filmes e Séries)
    if (isAll || typeFilter === 'MOVIE' || typeFilter === 'SERIES') {
      const tmdbKey = this.configService.get<string>('TMDB_API_KEY');
      const tmdbUrl = this.configService.get<string>('TMDB_API_URL');

      try {
        const { data } = await firstValueFrom(
          this.httpService.get<{
            results: Array<{
              id: number;
              media_type: string;
              title?: string;
              name?: string;
              poster_path?: string;
              backdrop_path?: string;
              release_date?: string;
              first_air_date?: string;
              vote_average?: number;
              overview?: string;
            }>;
          }>(`${tmdbUrl}/search/multi`, {
            params: { api_key: tmdbKey, language: 'pt-BR', query },
          }),
        );

        const tmdbMapped = data.results
          .filter((item) => {
            if (typeFilter === 'MOVIE' && item.media_type !== 'movie')
              return false;
            if (typeFilter === 'SERIES' && item.media_type !== 'tv')
              return false;
            return item.media_type === 'movie' || item.media_type === 'tv';
          })
          .map((item) => ({
            id: item.id,
            source: 'TMDB' as const,
            type:
              item.media_type === 'tv'
                ? ('SERIES' as const)
                : ('MOVIE' as const),
            title: item.title || item.name || 'Título Desconhecido',
            slug: this.slugify(item.title || item.name || 'title'),
            posterUrl: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : '',
            backdropUrl: item.backdrop_path
              ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
              : '',
            releaseDate: item.release_date || item.first_air_date || '',
            genres: [],
            status: 'RELEASED' as const,
            rating: item.vote_average || 0,
            extend: {
              value: 0,
              unit:
                item.media_type === 'tv'
                  ? ('EPISODES' as const)
                  : ('MINUTES' as const),
            },
            synopsis: item.overview || '',
          }));

        allResults = [...allResults, ...tmdbMapped];
      } catch (error) {
        console.error('Erro ao buscar no TMDB:', error);
      }
    }

    // 2. BUSCA NA RAWG (Jogos)
    if (isAll || typeFilter === 'GAME') {
      const rawgKey = this.configService.get<string>('RAWG_API_KEY');
      const rawgUrl = this.configService.get<string>('RAWG_API_URL');

      try {
        const { data } = await firstValueFrom(
          this.httpService.get<RawgResponse>(`${rawgUrl}/games`, {
            params: { key: rawgKey, search: query, page_size: 15 },
          }),
        );

        const rawgMapped = data.results.map((item) => ({
          id: item.id,
          source: 'RAWG' as const,
          type: 'GAME' as const,
          title: item.name || 'Título Desconhecido',
          slug: this.slugify(item.name || 'title'),
          posterUrl: item.background_image || '',
          backdropUrl: item.background_image || '',
          releaseDate: item.released || '',
          genres: [],
          status: 'RELEASED' as const,
          rating: item.rating ? item.rating * 2 : 0,
          extend: { value: item.playtime || 0, unit: 'HOURS' as const },
          synopsis: '',
        }));

        allResults = [...allResults, ...rawgMapped];
      } catch (error) {
        console.error('Erro na busca da RAWG', error);
      }
    }

    if (isAll || typeFilter === 'ANIME' || typeFilter === 'MANGA') {
      const resource = typeFilter === 'MANGA' ? 'manga' : 'anime';
      try {
        const { data } = await firstValueFrom(
          this.httpService.get<JikanResponse>(
            `https://api.jikan.moe/v4/${resource}`,
            {
              params: { q: query, limit: 10 },
            },
          ),
        );

        const jikanMapped = data.data.map((item) => ({
          id: item.mal_id,
          source: 'JIKAN' as const,
          type:
            typeFilter === 'MANGA' ? ('MANGA' as const) : ('ANIME' as const),
          title: item.title,
          slug: this.slugify(item.title),
          posterUrl: item.images?.jpg?.large_image_url || '',
          backdropUrl: item.images?.jpg?.large_image_url || '',
          releaseDate:
            typeFilter === 'MANGA'
              ? item.published?.from?.split('T')[0] || ''
              : item.aired?.from?.split('T')[0] || '',
          genres: [],
          status: 'RELEASED' as const,
          rating: item.score || 0,
          extend: {
            value:
              typeFilter === 'MANGA' ? item.chapters || 0 : item.episodes || 0,
            unit:
              typeFilter === 'MANGA'
                ? ('CHAPTERS' as const)
                : ('EPISODES' as const),
          },
          synopsis: item.synopsis || '',
        }));

        allResults = [...allResults, ...jikanMapped];
      } catch (error) {
        console.error('Erro na busca do Jikan', error);
      }
    }

    const validResults = allResults.filter((item) => item.posterUrl !== '');

    const normalize = (text: string) =>
      text
        .toLowerCase()
        .normalize('NFD')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/-/g, ' ')
        .trim();

    const normalizedQuery = normalize(query);

    const finalFiltered = validResults.filter((item) => {
      if (query.length <= 3) return true;

      const normalizedTitle = normalize(item.title);

      return normalizedTitle.includes(normalizedQuery);
    });

    return finalFiltered.sort((a, b) => {
      if (a.type === 'GAME' && b.type !== 'GAME') return 1;
      if (a.type !== 'GAME' && b.type === 'GAME') return -1;
      return 0;
    });
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
