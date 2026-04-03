import { getGames, getMovies, getSeries, getTopRatedMovies, getUpComingMovies, getAnimes, getMangas } from "./services/api";
import MediaCarousel from "./components/MediaCaroussel";

export default async function Home() {
  const [movies, series, topRated, upcoming, games, animes, mangas] = await Promise.all([
    getMovies(),
    getSeries(),
    getTopRatedMovies(),
    getUpComingMovies(),
    getGames(),
    getAnimes(),
    getMangas(),
  ]);

  return (
    <div className="min-h-screen pb-20 space-y-16 px-6 md:px-12 mt-8 overflow-hidden">
      <MediaCarousel
        title="Próximos Lançamentos"
        items={upcoming}
        colorClass="bg-yellow-500"
      />

      <MediaCarousel
        title="Animes Populares"
        items={animes}
        colorClass="bg-purple-500"
      />

      <MediaCarousel
        title="Mangás em Alta"
        items={mangas}
        colorClass="bg-orange-500"
      />

      <MediaCarousel
        title="Filmes Populares"
        items={movies}
        colorClass="bg-emerald-500"
      />

      <MediaCarousel
        title="Séries em Alta"
        items={series}
        colorClass="bg-blue-500"
      />

      <MediaCarousel
        title="Aclamados pela Crítica"
        items={topRated}
        colorClass="bg-white"
      />

      <MediaCarousel
        title="Jogos Populares"
        items={games}
        colorClass="bg-red-500"
      />
    </div>
  );
}