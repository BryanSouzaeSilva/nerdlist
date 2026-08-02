import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { MediaItem } from '../shared/interfaces/media-item.interface';
interface TmdbProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

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
  release_dates?: {
    results: {
      iso_3166_1: string;
      release_dates: { certification: string }[];
    }[];
  };
  content_ratings?: { results: { iso_3166_1: string; rating: string }[] };
  'watch/providers'?: {
    results: {
      BR?: {
        flatrate?: TmdbProvider[];
        rent?: TmdbProvider[];
        buy?: TmdbProvider[];
      };
    };
  };
  recommendations?: { results: TmdbMovie[] };
  production_companies?: Array<{ name: string }>;
  status?: string;
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
  genres?: { name: string }[];
  esrb_rating?: { id: number; slug: string; name: string } | null;
  stores?: Array<{ store: { id: number; name: string; slug: string } }>;
  platforms?: Array<{
    platform: { name: string };
    requirements_en?: { minumum?: string; recommended?: string };
  }>;
  developers?: Array<{ name: string }>;
  publishers?: Array<{ name: string }>;
}

interface RawgMovieResponse {
  results: Array<{
    id: number;
    data: { max: string };
  }>;
}

interface RawgResponse {
  results: RawgGame[];
}

interface JikanGenre {
  name: string;
  mal_id: number;
  type: string;
}

interface JikanItem {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
      image_url: string;
    };
  };
  aired?: { from: string };
  published?: { from: string };
  score: number;
  status: string;
  synopsis: string;
  episodes?: number;
  chapters?: number;
  genres: JikanGenre[];
  trailer?: {
    youtube_id: string;
  };
  rating?: string;
  studios?: Array<{ name: string }>;
  demographics?: Array<{ name: string }>;
  themes?: Array<{ name: string }>;
  authors?: Array<{ name: string }>;
}

interface JikanCastMember {
  character: {
    name: string;
    images: {
      jpg: { image_url: string };
    };
  };
  voice_actors: Array<{
    person: { name: string };
  }>;
}
interface JikanCharacterResponse {
  data: JikanCastMember[];
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
      this.httpService.get<{
        results: (TmdbMovie & {
          genre_ids?: number[];
          original_language?: string;
        })[];
      }>(`${apiUrl}/tv/popular`, {
        params: {
          api_key: apiKey,
          language: 'pt-BR',
        },
      }),
    );

    return data.results
      .filter(
        (item) =>
          !(item.genre_ids?.includes(16) && item.original_language === 'ja'),
      )
      .map((item) => ({
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

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<RawgResponse>(`${apiUrl}/games`, {
          params: {
            key: apiKey,
            ordering: '-added',
            page_size: 20,
          },
          timeout: 5000,
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
    } catch {
      console.warn(
        `RAWG API instável na Home. Ignorando jogos temporariamente.`,
      );
      return [];
    }
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
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<JikanResponse>(
          'https://api.jikan.moe/v4/top/manga',
        ),
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
    } catch {
      console.warn(
        'Jikan API bloqueou temporariamente a busca de Mangás (Rate Limit).',
      );
      return [];
    }
  }

  async findOne(id: number, type: string, source?: string): Promise<MediaItem> {
    const typeUpper = type?.toUpperCase();
    const sourceUpper = source?.toUpperCase();

    if (typeUpper === 'ANIME' && sourceUpper === 'TMDB') {
      try {
        return await this.fetchTmdbData(id, 'tv', 'ANIME');
      } catch {
        try {
          return await this.fetchTmdbData(id, 'movie', 'ANIME');
        } catch {
          throw new NotFoundException(`Anime não encontrado no TMDB`);
        }
      }
    }

    if (typeUpper === 'ANIME' || typeUpper === 'MANGA') {
      const resource = typeUpper === 'ANIME' ? 'anime' : 'manga';
      try {
        const detailsRes = await firstValueFrom(
          this.httpService.get<{ data: JikanItem }>(
            `https://api.jikan.moe/v4/${resource}/${id}`,
          ),
        );
        const item = detailsRes.data.data;

        let cast: {
          id: number;
          name: string;
          character: string;
          profileUrl: string;
        }[] = [];
        if (typeUpper === 'ANIME') {
          try {
            const charactersRes = await firstValueFrom(
              this.httpService.get<JikanCharacterResponse>(
                `https://api.jikan.moe/v4/anime/${id}/characters`,
              ),
            );
            cast = charactersRes.data.data
              .slice(0, 10)
              .map((c: JikanCastMember, index: number) => ({
                id: index,
                name: c.voice_actors?.[0]?.person?.name || c.character.name,
                character: c.character.name,
                profileUrl: c.character.images?.jpg?.image_url || '',
              }));
          } catch {
            console.warn(`Cast indisponível para ID ${id}`);
          }
        }

        const ageRating = this.mapJikanToBrRating(item.rating);

        const rawDate =
          typeUpper === 'ANIME' ? item.aired?.from : item.published?.from;

        let similar: any[] = [];
        try {
          const recRes = await firstValueFrom(
            this.httpService.get<{ data: Array<{ entry: JikanItem }> }>(
              `https://api.jikan.moe/v4/${resource}/${id}/recommendations`,
            ),
          );
          similar = (recRes.data.data?.slice(0, 10) || []).map((r) => ({
            id: r.entry.mal_id,
            title: r.entry.title,
            posterUrl: r.entry.images?.jpg?.large_image_url || '',
            releaseDate: '',
            rating: 0,
          }));
        } catch {
          console.warn(`Recomendações Indisponíveis para Jikan ID ${id}`);
        }

        let songs: { openings: string[]; endings: string[] } = {
          openings: [],
          endings: [],
        };
        if (typeUpper === 'ANIME') {
          try {
            const themesRes = await firstValueFrom(
              this.httpService.get<{
                data: { openings: string[]; endings: string[] };
              }>(`https://api.jikan.moe/v4/anime/${id}/themes`),
            );
            songs = {
              openings: themesRes.data.data?.openings || [],
              endings: themesRes.data.data?.endings || [],
            };
          } catch {
            console.warn(`Músicas indisponíveis para Anime ID ${id}`);
          }
        }

        const technical = {
          studios:
            item.studios?.map((s) => s.name) ||
            item.authors?.map((a) => a.name) ||
            [],
          demographics: item.demographics?.map((d) => d.name) || [],
          themes: item.themes?.map((t) => t.name) || [],
          status: item.status || 'Desconhecido',
        };

        return {
          id: item.mal_id,
          source: 'JIKAN',
          type: typeUpper === 'ANIME' ? 'ANIME' : 'MANGA',
          title: item.title,
          slug: this.slugify(item.title),
          posterUrl: item.images?.jpg?.large_image_url || '',
          backdropUrl: item.images?.jpg?.large_image_url || '',
          releaseDate: rawDate ? rawDate.split('T')[0] : '',
          genres: item.genres ? item.genres.map((g: JikanGenre) => g.name) : [],
          status: 'RELEASED',
          rating: item.score || 0,
          extend: {
            value:
              typeUpper === 'ANIME' ? item.episodes || 0 : item.chapters || 0,
            unit: typeUpper === 'ANIME' ? 'EPISODES' : 'CHAPTERS',
          },
          synopsis: item.synopsis || 'Sinopse não disponível.',
          trailerUrl: item.trailer?.youtube_id || '',
          cast,
          ageRating,
          similar,
          songs,
          technical,
        } as unknown as MediaItem;
      } catch {
        throw new NotFoundException(`${typeUpper} não encontrado no Jikan`);
      }
    }

    if (typeUpper === 'GAME') {
      const apiKey = this.configService.get<string>('RAWG_API_KEY');
      const apiUrl = this.configService.get<string>('RAWG_API_URL');

      try {
        const [detailsRes, moviesRes, seriesRes] = await Promise.all([
          firstValueFrom(
            this.httpService.get<RawgGame>(`${apiUrl}/games/${id}`, {
              params: { key: apiKey },
              timeout: 5000,
            }),
          ).catch(() => null),

          firstValueFrom(
            this.httpService.get<RawgMovieResponse>(
              `${apiUrl}/games/${id}/movies`,
              { params: { key: apiKey }, timeout: 5000 },
            ),
          ).catch(() => ({ data: { results: [] } })),

          firstValueFrom(
            this.httpService.get<RawgResponse>(
              `${apiUrl}/games/${id}/game-series`,
              { params: { key: apiKey }, timeout: 5000 },
            ),
          ).catch(() => ({ data: { results: [] } })),
        ]);

        if (!detailsRes || !detailsRes.data) {
          throw new NotFoundException(
            `Jogo indisponível ou não encontrado na RAWG`,
          );
        }

        const data = detailsRes.data;

        const trailer =
          moviesRes?.data?.results && moviesRes.data.results.length > 0
            ? moviesRes.data.results[0]?.data?.max || ''
            : '';

        const ageRating = this.mapEsrbToBrRating(data.esrb_rating?.slug);

        const watchProviders =
          data.stores?.map((s) => ({
            providerId: s.store.id,
            name: s.store.name,
            logoPath: '',
          })) || [];

        // Mapeamento corrigido dos jogos relacionados
        const similar = (seriesRes?.data?.results?.slice(0, 10) || []).map(
          (g) => ({
            id: g.id,
            title: g.name,
            type: 'GAME',
            posterUrl: g.background_image || '',
            releaseDate: g.released || '',
            rating: g.rating ? g.rating * 2 : 0,
          }),
        );

        const pcPlatform = data.platforms?.find(
          (p) => p.platform.name === 'PC',
        );
        const technical = {
          developers: data.developers?.map((d) => d.name) || [],
          publishers: data.publishers?.map((p) => p.name) || [],
          pcRequirements: pcPlatform?.requirements_en || null,
        };

        return {
          id: data.id,
          source: 'RAWG',
          type: 'GAME',
          title: data.name,
          slug: this.slugify(data.name),
          posterUrl: data.background_image || '',
          backdropUrl:
            data.background_image_additional || data.background_image || '',
          releaseDate: data.released || '',
          genres: Array.isArray(data.genres)
            ? data.genres.map((g) => g.name)
            : [],
          status: 'RELEASED',
          rating: data.rating ? data.rating * 2 : 0,
          extend: { value: data.playtime || 0, unit: 'HOURS' },
          synopsis:
            data.description_raw ||
            data.description ||
            'Sinopse não disponível.',
          trailerUrl: trailer,
          cast: [],
          ageRating,
          watchProviders,
          similar,
          technical,
        } as unknown as MediaItem;
      } catch (error) {
        if (error instanceof NotFoundException) throw error;
        throw new NotFoundException(`Jogo indisponível temporariamente`);
      }
    }

    const resourceType = typeUpper === 'SERIES' ? 'tv' : 'movie';
    const mappedType = typeUpper === 'SERIES' ? 'SERIES' : 'MOVIE';
    return this.fetchTmdbData(id, resourceType, mappedType);
  }

  private async fetchTmdbData(
    id: number,
    resourceType: 'tv' | 'movie',
    mappedType: 'MOVIE' | 'SERIES' | 'ANIME',
  ): Promise<MediaItem> {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    const apiUrl = this.configService.get<string>('TMDB_API_URL');

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<
          TmdbMovie & {
            videos?: { results: { key: string; site: string; type: string }[] };
            credits?: {
              cast: {
                id: number;
                name: string;
                character: string;
                profile_path: string;
              }[];
            };
          }
        >(`${apiUrl}/${resourceType}/${id}`, {
          params: {
            api_key: apiKey,
            language: 'pt-BR',
            append_to_response:
              'videos,credits,watch/providers,release_dates,content_ratings,recommendations',
          },
        }),
      );

      const trailer = data.videos?.results?.find(
        (v) =>
          v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'),
      );

      const cast =
        data.credits?.cast?.slice(0, 10).map((person) => ({
          id: person.id,
          name: person.name,
          character: person.character,
          profileUrl: person.profile_path
            ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
            : '',
        })) || [];

      // 1. Lógica para extrair a Classificação Indicativa BRASILEIRA
      let ageRating = 'Livre';
      if (resourceType === 'movie' && data.release_dates) {
        const brRelease = data.release_dates.results?.find(
          (r) => r.iso_3166_1 === 'BR',
        );
        if (
          brRelease &&
          brRelease.release_dates.length > 0 &&
          brRelease.release_dates[0].certification
        ) {
          ageRating = brRelease.release_dates[0].certification;
        }
      } else if (resourceType === 'tv' && data.content_ratings) {
        const brRating = data.content_ratings.results?.find(
          (r) => r.iso_3166_1 === 'BR',
        );
        if (brRating && brRating.rating) {
          ageRating = brRating.rating;
        }
      }

      // 2. Lógica para extrair os Provedores de Streaming no BRASIL (Ex: Netflix, Max)
      const brProviders = data['watch/providers']?.results?.BR;
      const watchProviders: {
        providerId: number;
        name: string;
        logoPath: string;
      }[] = [];

      if (brProviders?.flatrate) {
        watchProviders.push(
          ...brProviders.flatrate.map((p) => ({
            providerId: p.provider_id,
            name: p.provider_name,
            logoPath: `https://image.tmdb.org/t/p/original${p.logo_path}`,
          })),
        );
      }

      const similar = (data.recommendations?.results?.slice(0, 10) || []).map(
        (rec: TmdbMovie) => ({
          id: rec.id,
          title: rec.title || rec.name || 'Título Desconhecido',
          type: mappedType,
          posterUrl: rec.poster_path
            ? `https://image.tmdb.org/t/p/w500${rec.poster_path}`
            : '',
          releaseDate: rec.release_date || rec.first_air_date || '',
          rating: rec.vote_average || 0, // Corrigido para vote_average (com 'e')
        }),
      );

      const technical = {
        studios: data.production_companies?.map((c) => c.name) || [],
        status: data.status || 'Desconhecido',
      };

      return {
        id: data.id,
        source: 'TMDB',
        type: mappedType,
        title: data.title || data.name || 'Título Desconhecido',
        slug: this.slugify(data.title || data.name || 'title'),
        posterUrl: data.poster_path
          ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
          : '',
        backdropUrl: data.backdrop_path
          ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
          : '',
        releaseDate: data.release_date || data.first_air_date || '',
        genres: Array.isArray(data.genres)
          ? data.genres.map((g) => g.name)
          : [],
        status: 'RELEASED',
        rating: data.vote_average,
        extend: {
          value:
            resourceType === 'tv'
              ? data.number_of_episodes || 0
              : data.runtime || 0,
          unit: resourceType === 'tv' ? 'EPISODES' : 'MINUTES',
        },
        synopsis: data.overview,
        trailerUrl: trailer ? trailer.key : '',
        cast,
        // Injetando os novos dados no retorno
        ageRating,
        watchProviders,
        similar,
        technical,
      } as unknown as MediaItem; // Conversão segura para satisfazer a interface
    } catch {
      throw new NotFoundException(`Item com ID ${id} não encontrado no TMDB`);
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

    if (
      isAll ||
      typeFilter === 'MOVIE' ||
      typeFilter === 'SERIES' ||
      typeFilter === 'ANIME'
    ) {
      const tmdbKey = this.configService.get<string>('TMDB_API_KEY');
      const tmdbUrl = this.configService.get<string>('TMDB_API_URL');
      try {
        const { data } = await firstValueFrom(
          this.httpService.get<{
            results: (TmdbMovie & {
              media_type: string;
              original_language?: string;
              genre_ids?: number[];
            })[];
          }>(`${tmdbUrl}/search/multi`, {
            params: { api_key: tmdbKey, language: 'pt-BR', query },
          }),
        );
        const tmdbMapped = data.results
          .filter(
            (item) => item.media_type === 'movie' || item.media_type === 'tv',
          )
          .map((item) => {
            const isAnime =
              item.original_language === 'ja' && item.genre_ids?.includes(16);
            let finalType: 'MOVIE' | 'SERIES' | 'ANIME' = 'MOVIE';
            if (isAnime) finalType = 'ANIME';
            else if (item.media_type === 'tv') finalType = 'SERIES';

            return {
              id: item.id,
              source: 'TMDB' as const,
              type: finalType,
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
            };
          })
          .filter((item) => {
            if (typeFilter && typeFilter !== 'ALL')
              return item.type === typeFilter;
            return true;
          });
        allResults = [...allResults, ...tmdbMapped];
      } catch (error) {
        console.error('Erro ao buscar no TMDB:', error);
      }
    }

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

    const jikanSearches: Array<'anime' | 'manga'> = [];
    if (isAll || typeFilter === 'ANIME') jikanSearches.push('anime');
    if (isAll || typeFilter === 'MANGA') jikanSearches.push('manga');

    for (const resource of jikanSearches) {
      try {
        const { data } = await firstValueFrom(
          this.httpService.get<JikanResponse>(
            `https://api.jikan.moe/v4/${resource}`,
            { params: { q: query, limit: 10 } },
          ),
        );
        const jikanMapped = data.data.map((item) => ({
          id: item.mal_id,
          source: 'JIKAN' as const,
          type: resource === 'manga' ? ('MANGA' as const) : ('ANIME' as const),
          title: item.title,
          slug: this.slugify(item.title),
          posterUrl: item.images?.jpg?.large_image_url || '',
          backdropUrl: item.images?.jpg?.large_image_url || '',
          releaseDate:
            resource === 'manga'
              ? item.published?.from?.split('T')[0] || ''
              : item.aired?.from?.split('T')[0] || '',
          genres: [],
          status: 'RELEASED' as const,
          rating: item.score || 0,
          extend: {
            value:
              resource === 'manga' ? item.chapters || 0 : item.episodes || 0,
            unit:
              resource === 'manga'
                ? ('CHAPTERS' as const)
                : ('EPISODES' as const),
          },
          synopsis: item.synopsis || '',
        }));
        allResults = [...allResults, ...jikanMapped];
      } catch (error) {
        console.error(`Erro na busca do Jikan (${resource})`, error);
      }
    }

    const validResults = allResults.filter((item) => item.posterUrl !== '');
    const normalize = (text: string) =>
      text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/-/g, ' ')
        .trim();
    const normalizedQuery = normalize(query);
    const finalFiltered = validResults.filter((item) => {
      if (query.length <= 3) return true;
      return normalize(item.title).includes(normalizedQuery);
    });

    const seen = new Set();
    const uniqueResults = finalFiltered.filter((item) => {
      const year = item.releaseDate ? item.releaseDate.split('-')[0] : '0000';
      const key = `${this.slugify(item.title)}-${year}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return uniqueResults.sort((a, b) => {
      if (a.type === 'GAME' && b.type !== 'GAME') return 1;
      if (a.type !== 'GAME' && b.type === 'GAME') return -1;
      return 0;
    });
  }

  private mapEsrbToBrRating(esrbSlug?: string): string {
    if (!esrbSlug) return 'Livre';
    const slug = esrbSlug.toLowerCase();
    if (slug.includes('everyone-10')) return '10';
    if (slug.includes('everyone')) return 'Livre';
    if (slug.includes('teen')) return '12';
    if (slug.includes('mature')) return '16';
    if (slug.includes('adults')) return '18';
    return 'Livre';
  }

  private mapJikanToBrRating(rating?: string): string {
    if (!rating) return 'Livre';
    const r = rating.toLowerCase();
    if (r.includes('g -') || r.includes('all ages')) return 'Livre';
    if (r.includes('pg -') || r.includes('children')) return '10';
    if (r.includes('pg-13') || r.includes('teens')) return '14';
    if (r.includes('r - 17') || r.includes('violence')) return '16';
    if (r.includes('r+') || r.includes('rx') || r.includes('hentai'))
      return '18';
    return '12';
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
