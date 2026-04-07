import { Controller, Get, Param, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Get('series')
  findAllSeries() {
    return this.moviesService.findAllSeries();
  }

  @Get('top-rated')
  findTopRated() {
    return this.moviesService.findTopRated();
  }

  @Get('upcoming')
  findUpComing() {
    return this.moviesService.findUpComing();
  }

  @Get('games')
  findAllGames() {
    return this.moviesService.findAllGames();
  }

  @Get('animes')
  findAllAnimes() {
    return this.moviesService.findAllAnimes();
  }

  @Get('mangas')
  findAllMangas() {
    return this.moviesService.findAllMangas();
  }

  @Get('search')
  search(@Query('q') q: string, @Query('type') type?: string) {
    return this.moviesService.search(q, type);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('type') type: string,
    @Query('source') source?: string,
  ) {
    return this.moviesService.findOne(+id, type, source);
  }
}
