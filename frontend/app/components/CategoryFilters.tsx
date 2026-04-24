"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const currentQ = searchParams.get("q") || "";
    const currentType = searchParams.get("type") || "ALL";

    const categories = [
        { id: 'ALL', label: 'Tudo' },
        { id: 'MOVIE', label: 'Filmes' },
        { id: 'SERIES', label: 'Séries' },
        { id: 'ANIME', label: 'Animes' },
        { id: 'GAME', label: 'Jogos' }
    ];

    const handleFilter = (type: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (type === 'ALL') {
            params.delete("type");
        } else {
            params.set("type", type);
        }

        // Navega para a nova URL mantendo o termo de busca
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => {
                const isActive = currentType === cat.id;
                return (
                    <button 
                        key={cat.id}
                        onClick={() => handleFilter(cat.id)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border shrink-0 ${
                            isActive 
                            ? "bg-emerald-500 border-emerald-500 text-neutral-950 scale-105 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                            : "bg-neutral-900 border-white/5 text-neutral-500 hover:text-white hover:border-white/10"
                        }`}
                    >
                        {cat.label}
                    </button>
                );
            })}
        </div>
    );
}