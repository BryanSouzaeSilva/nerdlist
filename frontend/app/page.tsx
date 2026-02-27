import { getMovies, getSeries } from "./services/api";
import MediaCarousel from "./components/MediaCaroussel";

export default async function Home() {
  const [movies, series] = await Promise.all([
    getMovies(),
    getSeries()
  ]);

  return (
    <div className="min-h-screen pb-20 space-y-16 px-6 md:px-12 mt-8 overflow-hidden">
      
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

    </div>
  );
}