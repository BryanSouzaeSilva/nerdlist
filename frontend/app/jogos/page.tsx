import { getGames } from "../services/api";
import MediaGrid from "../components/MediaGrid";
export const dynamic = "force-dynamic";

export default async function JogosPage() {
    const games = await getGames();

    return (
        <div className="min-h-screen p-8 md:p-12 max-w-[1800px] mx-auto">
        <header className="mb-10">
            <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                <span className="w-2 h-8 bg-red-500 rounded-full" />
                Jogos
            </h1>
            <p className="text-gray-400">Os maiores sucessos do mundo dos games.</p>
        </header>
        
        <MediaGrid items={games} />
        </div>
    );
}