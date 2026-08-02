"use client";

import { useState, useEffect } from "react";
import { X, Rocket, CheckCircle2, ChevronRight, Clock, Star } from "lucide-react";

export default function ChangelogModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const VERSION_KEY = "nerdlist_changelog_v0.3.0";
    const SESSION_KEY = "nerdlist_session_viewed_v0.3.0";

    useEffect(() => {
        const hiddenForever = localStorage.getItem(VERSION_KEY);
        const viewedInSession = sessionStorage.getItem(SESSION_KEY);

        if (!hiddenForever && !viewedInSession) {
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem(VERSION_KEY, "true");
        }
        sessionStorage.setItem(SESSION_KEY, "true");
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Truque Mágico aqui: max-h-[90vh] para não estourar a tela.
                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] oculta a barra feia mas mantém a rolagem!
            */}
            <div className="bg-neutral-900 border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
                
                {/* Cabeçalho - Mais compacto no mobile */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 sm:p-6 flex justify-between items-start sticky top-0 z-10">
                    <div>
                        <div className="flex items-center gap-2 text-neutral-950 bg-white/20 w-fit px-3 py-1 rounded-full mb-1 sm:mb-2">
                            <Star size={12} className="fill-neutral-950" />
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Atualização v0.3.0</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tighter">A Maturidade Multimídia</h2>
                    </div>
                    <button onClick={handleClose} className="text-white/50 hover:text-white transition-colors p-1">
                        <X size={20} />
                    </button>
                </div>

                {/* Corpo do Modal - Paddings e margens reduzidas no mobile */}
                <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                    
                    {/* O que mudou */}
                    <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-[11px] sm:text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <Rocket size={14} /> Já disponível
                        </h3>
                        <ul className="space-y-2 sm:space-y-3">
                            {[
                                "Classificação Indicativa: Padrão brasileiro unificado e com cores.",
                                "Onde Assistir & Comprar: Plataformas de streaming e lojas de jogos.",
                                "Aba Relacionados: Descubra sequências e franquias das suas obras.",
                                "Aba Músicas: Aberturas de Animes e atalhos para OST (Spotify/YouTube).",
                                "Ficha Técnica: Requisitos de PC para jogos, estúdios e status.",
                                "Sistema Anti-Quedas: Backend resiliente que blinda o NerdList se APIs caírem.",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-neutral-300 font-medium leading-snug sm:leading-relaxed">
                                    <ChevronRight size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Próxima Sprint - Oculto em telas muito pequenas para economizar espaço */}
                    <div className="hidden sm:block bg-white/5 border border-white/5 p-5 rounded-2xl space-y-3">
                        <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={14} /> Na mira (Próxima Etapa)
                        </h3>
                        <p className="text-sm text-neutral-400 italic pl-6">
                            Monitoramento de falhas em tempo real (Sentry) e Testes (Jest).
                        </p>
                    </div>

                    {/* Rodapé de Ações */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 sm:pt-4 border-t border-white/5">
                        <label className="flex items-center justify-center sm:justify-start gap-3 cursor-pointer group w-full sm:w-auto">
                            <div className="relative flex-shrink-0">
                                <input
                                    type="checkbox"
                                    className="peer hidden"
                                    checked={dontShowAgain}
                                    onChange={(e) => setDontShowAgain(e.target.checked)}
                                />
                                <div className="w-5 h-5 border-2 border-neutral-700 rounded-md peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all" />
                                <CheckCircle2 className="absolute inset-0 text-neutral-950 scale-0 peer-checked:scale-75 transition-transform mx-auto" />
                            </div>
                            <span className="text-[11px] sm:text-xs text-neutral-500 font-bold group-hover:text-neutral-300 transition-colors">
                                Não mostrar novamente
                            </span>
                        </label>

                        <button
                            onClick={handleClose}
                            className="w-full sm:w-auto bg-white text-neutral-950 px-8 py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm hover:bg-emerald-500 transition-all active:scale-95 uppercase tracking-wider shadow-lg"
                        >
                            Incrível!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}