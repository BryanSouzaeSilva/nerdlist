import { searchMedia } from "../services/api";
import MediaGrid from "../components/MediaGrid";
import Link from "next/link";

interface SearchPageProps {
    searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function SearchPage(props: SearchPageProps) {
    const searchParams = await props.searchParams;
    const query = searchParams.q || "";
    const currentType = searchParams.type || "ALL";

    const results = await searchMedia(query, currentType);

    const filters = [
        { label: "Todos", value: "ALL" },
        { label: "Filmes", value: "MOVIE" },
        { label: "Séries", value: "SERIES" },
        { label: "Jogos", value: "GAME" },
        { label: "Animes", value: "ANIME" },
        { label: "Mangás", value: "MANGA" },
    ];

    return (
        <div className="min-h-screen p-8 md:p-12 max-w-[1800px] mx-auto">
        
        <header className="mb-10">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6">
                Resultados para <span className="text-emerald-500">&quot;{query}&quot;</span>
            </h1>

            <div className="flex flex-wrap gap-3">
                {filters.map((filter) => {
                    const isActive = currentType === filter.value;
                    return (
                        <Link
                            key={filter.value}
                            href={`/search?q=${query}&type=${filter.value}`}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            isActive
                                ? "bg-emerald-500 text-neutral-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                : "bg-neutral-900 border border-neutral-700 text-gray-300 hover:bg-neutral-800"
                            }`}
                        >
                            {filter.label}
                        </Link>
                    );
                })}
            </div>
        </header>
        
        {results.length > 0 ? (
            <MediaGrid items={results} />
        ) : (
            <div className="py-20 text-center">
            <p className="text-2xl text-gray-500 font-medium">Nenhum resultado encontrado.</p>
            <p className="text-gray-600 mt-2">Tente ajustar a busca ou limpar os filtros.</p>
            </div>
        )}

        </div>
    );
}