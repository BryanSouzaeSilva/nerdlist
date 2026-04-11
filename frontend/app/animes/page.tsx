import { getAnimes } from "../services/api";
import MediaGrid from "../components/MediaGrid";
export const dynamic = "force-dynamic";

export default async function AnimesPage() {
    const animes = await getAnimes();

    return (
        <div className="min-h-screen p-8 md:p-12 max-w-[1800px] mx-auto mt-16">
            <header className="mb-10">
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
                    Top <span className="text-purple-500">Animes</span>
                </h1>
                <p className="text-gray-400">As animações japonesas mais bem avaliadas de todos os tempos.</p>
            </header>
            
            <MediaGrid items={animes} />
        </div>
    );
}