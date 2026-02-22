import Link from "next/link";
import { getMovies, getSeries } from "./services/api";
import Image from "next/image";

export default async function Home() {
  const [movies, series] = await Promise.all([
    getMovies(),
    getSeries(),
  ])

  return (
    <main className="min-h-screen bg-neutral-950 text-gray-200 p-8">
      <header className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-emerald-400 tracking-tighter">
          NerdList
        </h1>
        <div className="text-sm text-gray-500">
          Back-end status: {movies.length > 0 || series.length > 0 ? "🟢 Online" : "🔴 Offline"}
        </div>
      </header>

      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-6 border-l-4 border-emerald-500 pl-3">
          Filmes Populares
        </h2>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}?type=MOVIE`}
              className="group relative bg-neutral-900 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 border border-neutral-800 hover:border-emerald-500/50 block"
            >
              <div className="relative aspect-[2/3] w-full">
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
              </div>

              <div className="absolute bottom-0 p-4 w-full">
                <h3 className="font-bold text-lg leading-tight truncate">
                  {movie.title}
                </h3>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                  <span>{movie.releaseDate.split("-")[0]}</span>
                  <span className="bg-neutral-800 px-2 py-1 rounded border border-neutral-700">
                    {movie.type}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6 border-l-4 border-blue-500 pl-3">
          Séries em Alta
        </h2>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
          {series.map((item) => (
            <Link
              key={item.id}
              href={`/movie/${item.id}?type=SERIES`}
              className="group relative bg-neutral-900 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 border border-neutral-800 hover:border-blue-500/50 block"
            >
              <div className="relative aspect-[2/3] w-full">
                <Image
                  src={item.posterUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
              </div>

              <div className="absolute bottom-0 p-4 w-full">
                <h3 className="font-bold text-lg leading-tight truncate">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                  <span>{item.releaseDate.split("-")[0]}</span>
                  <span className="bg-neutral-800 px-2 py-1 rounded border border-neutral-700">
                    {item.type}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}