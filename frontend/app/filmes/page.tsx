import { getMovies } from "../services/api";
import MediaGrid from "../components/MediaGrid";
export const dynamic = "force-dynamic";

export default async function FilmesPage() {
    const movies = await getMovies();

    return (
        <div className="min-h-screen p-8 md:p-12 max-w-[1800px] mx-auto">
        <header className="mb-10">
            <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                <span className="w-2 h-8 bg-emerald-500 rounded-full" />
                Filmes
            </h1>
            <p className="text-gray-400">Explore os títulos mais populares do cinema.</p>
        </header>
        
        <MediaGrid items={movies} />
        </div>
    );
}