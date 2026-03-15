import { getSeries } from "../services/api";
import MediaGrid from "../components/MediaGrid";

export default async function SeriesPage() {
    const series = await getSeries();

    return (
        <div className="min-h-screen p-8 md:p-12 max-w-[1800px] mx-auto">
        <header className="mb-10">
            <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-500 rounded-full" />
                Séries
            </h1>
            <p className="text-gray-400">As séries que estão dando o que falar.</p>
        </header>
        
        <MediaGrid items={series} />
        </div>
    );
}