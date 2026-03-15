import { getMangas } from "../services/api";
import MediaGrid from "../components/MediaGrid";

export default async function MangasPage() {
    const mangas = await getMangas();

    return (
        <div className="min-h-screen p-8 md:p-12 max-w-[1800px] mx-auto mt-16">
            <header className="mb-10">
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
                    Top <span className="text-orange-500">Mangás</span>
                </h1>
                <p className="text-gray-400">As obras mais populares e aclamadas pelos leitores.</p>
            </header>
            
            <MediaGrid items={mangas} />
        </div>
    );
}