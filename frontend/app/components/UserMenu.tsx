"use client";

import { useState, useRef, useEffect } from "react";
import { User as UserIcon, LogOut, UserCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface UserProps {
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

export default function UserMenu({ user, onSignOut }: { user: UserProps, onSignOut: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10 text-left"
            >
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-transparent hover:border-emerald-500 transition-all overflow-hidden flex items-center justify-center shadow-lg bg-linear-to-br from-neutral-800 to-neutral-900">
                        {user?.image ? (
                            <Image
                                src={user.image}
                                alt="Avatar"
                                width={40}
                                height={40}
                                className="object-cover"
                            />
                        ) : (
                            <UserIcon size={20} className="text-neutral-400 hover:text-white transition-colors" />
                        )}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-neutral-950 rounded-full shadow-sm" />
                </div>

                <div className="hidden sm:flex flex-col">
                    <span className="text-sm font-bold text-white hover:text-emerald-500 transition-colors leading-none mb-1">
                        {user?.name?.split(" ")[0]}
                    </span>
                    <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider leading-none">
                        Nível 1
                    </span>
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <Link
                        href="/perfil"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-300 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                    >
                        <UserCircle size={16} className="text-emerald-500" />
                        Meu Perfil
                    </Link>

                    <div className="h-px w-full bg-neutral-800 my-1" />

                    <form action={onSignOut}>
                        <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 font-bold transition-colors">
                            <LogOut size={16} />
                            Sair da conta
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}