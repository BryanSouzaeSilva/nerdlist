"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Opcional: Aqui nós enviamos o erro pro Sentry, lembra?
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
            <div className="bg-neutral-900 border border-red-500/20 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500" />
                
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                
                <h1 className="text-2xl md:text-3xl font-black text-white mb-4">Algo deu errado!</h1>
                <p className="text-gray-400 mb-8 leading-relaxed">
                    Não conseguimos carregar as informações desta mídia. Pode ser uma falha de conexão ou os dados não estão mais disponíveis.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()} // <--- MÁGICA AQUI: Recarrega o componente!
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all"
                    >
                        <RotateCcw size={18} />
                        Tentar Novamente
                    </button>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold transition-all"
                    >
                        Voltar ao Início
                    </Link>
                </div>
            </div>
        </main>
    );
}