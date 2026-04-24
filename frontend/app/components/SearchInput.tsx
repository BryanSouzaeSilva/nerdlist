"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchInput({ initialValue = "" }: { initialValue?: string }) {
    const [query, setQuery] = useState(initialValue);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-emerald-500 transition-colors">
                <Search size={20} />
            </div>
            
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busque por títulos, estúdios ou gêneros..."
                className="w-full bg-neutral-900 border border-white/5 rounded-2xl py-5 pl-14 pr-12 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-2xl"
                autoFocus
            />

            {query && (
                <button 
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-neutral-600 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            )}
        </form>
    );
}