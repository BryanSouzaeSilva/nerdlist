"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlQuery = searchParams.get("q") || "";
    
    const [query, setQuery] = useState(urlQuery);
    const [lastUrlQuery, setLastUrlQuery] = useState(urlQuery);

    if (urlQuery !== lastUrlQuery) {
        setQuery(urlQuery);
        setLastUrlQuery(urlQuery);
    }

    useEffect(() => {
        if (query === urlQuery) return;

        const delayDebounceFn = setTimeout(() => {
            if (query.trim().length > 0) {
                router.replace(`/search?q=${encodeURIComponent(query)}`);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query, router, urlQuery]);

    return (
        <div className="relative w-full max-w-md hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Buscar animes, mangás, jogos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-neutral-800 rounded-full bg-neutral-900 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors sm:text-sm"
            />
        </div>
    );
}