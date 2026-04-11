import Link from "next/link";
import { Ghost, Home } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-8">
                    <Ghost size={120} className="text-emerald-500 animate-bounce" strokeWidth={1} />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/50 rounded-full blur-sm" />
                </div>

                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 drop-shadow-xl">
                    4<span className="text-emerald-500">0</span>4
                </h1>

                <h2 className="text-xl md:text-2xl font-bold text-neutral-300 mb-4 uppercase tracking-widest">
                    Página perdida no Multiverso
                </h2>

                <p className="text-neutral-500 max-w-md mb-10 font-medium">
                    Acho que você tentou acessar um filme e acabou caindo nas Backrooms. Essa página não existe no NerdList!
                </p>

                <Link
                    href="/"
                    className="group flex items-center gap-3 px-8 py-4 bg-white text-neutral-950 font-black uppercase text-sm rounded-full tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)]"
                >
                    <Home size={18} className="group-hover:-translate-y-1 transition-transform" />
                    Voltar para o Início
                </Link>
            </div>
        </main>
    );
}