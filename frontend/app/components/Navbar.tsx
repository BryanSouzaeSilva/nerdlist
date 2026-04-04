"use client";

import { Clapperboard, Search, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchTerm.trim() !== "") {
        router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    const navLinks = [
        { name: "Início", href: "/" },
        { name: "Filmes", href: "/filmes" },
        { name: "Séries", href: "/series" },
        { name: "Animes", href: "/animes" },
        { name: "Mangás", href: "/mangas" },
        { name: "Jogos", href: "/jogos" },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-neutral-950/90 backdrop-blur-xl">
            <div className="max-w-450 mx-auto px-6 h-20 flex items-center justify-between gap-8">
                
                <div className="shrink-0">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-emerald-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                            <Clapperboard className="w-5 h-5 text-neutral-950" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tighter hidden lg:block">
                            Nerd<span className="text-emerald-500">List</span>
                        </span>
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center gap-8">
                    <ul className="hidden xl:flex items-center gap-6">
                        {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                href={link.href}
                                className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full" />
                            </Link>
                        </li>
                        ))}
                    </ul>

                    <div className="flex-1 max-w-lg relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="O que vamos explorar hoje?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-gray-200 outline-none focus:bg-white/10 focus:border-emerald-500/40 transition-all placeholder:text-gray-600"
                        />
                    </div>
                </div>

                <Link
                    href="/perfil"
                    className="shrink-0 flex items-center gap-3 group cursor-pointer p-1 pr-3 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                    title="Meu Perfil"
                >
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-transparent group-hover:border-emerald-500 transition-all overflow-hidden flex items-center justify-center shadow-lg bg-linear-to-br from-neutral-800 to-neutral-900">
                            <User size={20} className="text-neutral-400 group-hover:text-white transition-colors" />
                        </div>
                        
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-neutral-950 rounded-full shadow-sm" />
                    </div>

                    <div className="flex flex-col hidden sm:flex">
                        <span className="text-sm font-bold text-white group-hover:text-emerald-500 transition-colors leading-none mb-1">
                            Bryan
                        </span>
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider leading-none">
                            Nível 5
                        </span>
                    </div>
                </Link>

            </div>
        </nav>
    );
}