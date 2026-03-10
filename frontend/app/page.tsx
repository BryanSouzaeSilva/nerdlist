import { getGames, getMovies, getSeries, getTopRatedMovies, getUpComingMovies } from "./services/api";
import MediaCarousel from "./components/MediaCaroussel";

export default async function Home() {
  const [movies, series, topRated, upcoming, games] = await Promise.all([
    getMovies(),
    getSeries(),
    getTopRatedMovies(),
    getUpComingMovies(),
    getGames(),
  ]);

  return (
    <div className="min-h-screen pb-20 space-y-16 px-6 md:px-12 mt-8 overflow-hidden">
      <MediaCarousel
        title="Próximos Lançamentos"
        items={upcoming}
        colorClass="bg-yellow-500"
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
        colorClass="bg-purple-500"
      />

      <MediaCarousel
        title="Jogos Populares"
        items={games}
        colorClass="bg-red-500"
      />
    </div>
  );
}