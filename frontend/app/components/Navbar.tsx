import { Clapperboard, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

export default async function Navbar() {
    const session = await auth();

    const navLinks = [
        { name: "Início", href: "/" },
        { name: "Filmes", href: "/filmes" },
        { name: "Séries", href: "/series" },
        { name: "Animes", href: "/animes" },
        { name: "Mangás", href: "/mangas" },
        { name: "Jogos", href: "/jogos" },
    ];

    const handleSignOut = async () => {
        "use server";
        await signOut();
    };

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

                    <SearchBar />
                </div>

                <div className="shrink-0">
                    {session?.user ? (
                        <UserMenu user={session.user} onSignOut={handleSignOut} />
                    ) : (
                        <Link
                            href="/login"
                            className="shrink-0 flex items-center gap-3 group cursor-pointer p-1 pr-3 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-transparent group-hover:border-emerald-500 transition-all overflow-hidden flex items-center justify-center shadow-lg bg-linear-to-br from-neutral-800 to-neutral-900">
                                    <UserIcon size={20} className="text-neutral-400 group-hover:text-white transition-colors" />
                                </div>
                            </div>

                            <div className="flex flex-col hidden sm:flex">
                                <span className="text-sm font-bold text-white group-hover:text-emerald-500 transition-colors leading-none mb-1">
                                    Entrar
                                </span>
                            </div>
                        </Link>
                    )}
                </div>

            </div>
        </nav>
    );
}