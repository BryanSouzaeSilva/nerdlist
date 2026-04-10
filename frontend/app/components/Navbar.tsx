import { Clapperboard, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { auth, signIn, signOut } from "@/auth";
import SearchBar from "./SearchBar";

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
                        <div className="flex items-center gap-3 group relative cursor-pointer p-1 pr-3 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
                            <Link href="/perfil" className="flex items-center gap-3 w-full h-full">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-transparent group-hover:border-emerald-500 transition-all overflow-hidden flex items-center justify-center shadow-lg bg-linear-to-br from-neutral-800 to-neutral-900">
                                        {session.user.image ? (
                                            <Image 
                                                src={session.user.image} 
                                                alt="Avatar" 
                                                width={40} 
                                                height={40} 
                                                className="object-cover"
                                            />
                                        ) : (
                                            <UserIcon size={20} className="text-neutral-400 group-hover:text-white transition-colors" />
                                        )}
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-neutral-950 rounded-full shadow-sm" />
                                </div>

                                <div className="flex flex-col hidden sm:flex">
                                    <span className="text-sm font-bold text-white group-hover:text-emerald-500 transition-colors leading-none mb-1">
                                        {session.user.name?.split(" ")[0]}
                                    </span>
                                    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider leading-none">
                                        Nível 1
                                    </span>
                                </div>
                            </Link>

                            <div className="absolute right-0 top-full mt-2 w-40 bg-neutral-900 border border-white/10 rounded-lg shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                <form action={async () => {
                                    "use server";
                                    await signOut();
                                }}>
                                    <button type="submit" className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-white/5 font-bold transition-colors">
                                        <LogOut size={14} />
                                        Sair da conta
                                    </button>
                                </form>
                            </div>
                        </div>
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