"use client";

import { useState, useEffect } from "react";
import { Bell, Menu } from "lucide-react";
import Link from "next/link";

export default function MobileHeader() {
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
        if (window.scrollY > lastScrollY && window.scrollY > 50) {
            setShow(false);
        } else {
            setShow(true);
        }
        setLastScrollY(window.scrollY);
        };

        window.addEventListener("scroll", controlNavbar);
        return () => window.removeEventListener("scroll", controlNavbar);
    }, [lastScrollY]);

    return (
        <header
        className={`fixed top-0 left-0 w-full h-16 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5 z-50 transition-transform duration-300 md:hidden flex items-center justify-between px-6 ${
            show ? "translate-y-0" : "-translate-y-full"
        }`}
        >
        <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <span className="font-black text-neutral-950 text-xl">N</span>
            </div>
            <span className="font-black text-lg tracking-tighter text-white">NerdList</span>
        </Link>

        <div className="flex items-center gap-4">
            <button className="text-neutral-400 hover:text-emerald-500 transition-colors">
            <Bell size={22} />
            </button>
            <button className="text-neutral-400 hover:text-white">
            <Menu size={22} />
            </button>
        </div>
        </header>
    );
}