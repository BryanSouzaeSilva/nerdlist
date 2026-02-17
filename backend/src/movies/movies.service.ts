import { Injectable } from '@nestjs/common';
import { MediaItem } from 'src/shared/interfaces/media-item.interface';

@Injectable()
export class MoviesService {
  findAll(): MediaItem[] {
    return [
      {
        id: 550,
        source: 'TMDB',
        slug: 'clube-da-luta',
        title: 'Clube da Luta',
        posterUrl:
          'https://image.tmdb.org/t/p/original/pB8BM7pdSp6B6Ih7Qf4n6a8MUBp.jpg',
        backdropUrl:
          'https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
        type: 'MOVIE',
        releaseDate: '1999-10-15',
        genres: ['Drama'],
        status: 'RELEASED',
        rating: 8.4,
        extent: { value: 139, unit: 'MINUTES' },
      },
      {
        id: 157336,
        source: 'TMDB',
        slug: 'interestelar',
        title: 'Interestelar',
        posterUrl:
          'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        backdropUrl:
          'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
        type: 'MOVIE',
        releaseDate: '2014-11-05',
        genres: ['Ficção Científica', 'Drama', 'Aventura'],
        status: 'RELEASED',
        rating: 8.4,
        extent: { value: 169, unit: 'MINUTES' },
      },
    ];
  }

  findOne(id: number) {
    return `This action returns a #${id} movie`;
  }
}
