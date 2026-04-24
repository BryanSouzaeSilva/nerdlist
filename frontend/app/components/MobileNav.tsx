"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, User, MessageCircle } from "lucide-react";

export default function MobileNav() {
    const pathname = usePathname();

    const links = [
        { href: "/", icon: Home, label: "Início" },
        { href: "/search", icon: Search, label: "Busca" },
        { href: "/add", icon: PlusSquare, label: "Novo" },
        { href: "/social", icon: MessageCircle, label: "Amigos" },
        { href: "/perfil", icon: User, label: "Perfil" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 z-50 w-full h-16 bg-neutral-950/80 backdrop-blur-xl border-t border-white/10 md:hidden">
            <div className="grid h-full grid-cols-5 mx-auto font-medium">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex flex-col items-center justify-center px-5 group"
                        >
                            <Icon
                                size={24}
                                className={`${isActive ? "text-emerald-500 scale-110" : "text-neutral-500"} transition-all duration-300`} 
                            />
                            <span className={`text-[10px] mt-1 ${isActive ? "text-emerald-500 font-bold" : "text-neutral-500"}`}>
                                {link.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}