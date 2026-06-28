"use client"; // Arquivos de erro PRECISAM ser Client Components

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // No futuro (etapa de Logs), é aqui que enviaremos o erro para o Sentry/Datadog
        console.error("NerdList capturou um erro fatal:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                <AlertTriangle size={48} className="text-red-500" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                Ops! Um erro inesperado ocorreu.
            </h1>
            
            <p className="text-neutral-400 max-w-md mx-auto mb-8 text-sm md:text-base leading-relaxed">
                Tivemos um problema de comunicação com nossos servidores ou com a base de dados de mídias. Não se preocupe, o problema não é com você.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => reset()}
                    className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-6 py-3 rounded-xl font-bold transition-all"
                >
                    <RefreshCcw size={18} />
                    Tentar Novamente
                </button>

                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                    <Home size={18} />
                    Voltar ao Início
                </Link>
            </div>

            <div className="mt-12 p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg max-w-lg w-full text-left overflow-hidden">
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mb-2">Log do Erro:</p>
                <p className="text-xs text-red-400 font-mono break-words">{error.message || "Erro desconhecido no servidor"}</p>
            </div>
        </div>
    );
}