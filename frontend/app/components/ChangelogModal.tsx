"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Rocket, CheckCircle2, ChevronRight } from "lucide-react";

export default function ChangelogModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const VERSION_KEY = "nerdlist_changelog_v0.2";
    const SESSION_KEY = "nerdlist_session_viewed";

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
        <div className="bg-neutral-900 border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            
            <div className="bg-linear-to-r from-emerald-600 to-teal-600 p-6 flex justify-between items-start">
            <div>
                <div className="flex items-center gap-2 text-neutral-950 bg-white/20 w-fit px-3 py-1 rounded-full mb-2">
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Atualização v0.2</span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tighter">A Fundação Adaptativa</h2>
            </div>
            <button onClick={handleClose} className="text-white/50 hover:text-white transition-colors">
                <X size={24} />
            </button>
            </div>

            <div className="p-8 space-y-8">
            <div className="space-y-4">
                <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={14} /> Já disponível
                </h3>
                <ul className="space-y-3">
                {[
                    "Design Adaptativo (Experiência Mobile estilo App)",
                    "Novo sistema de Abas no Perfil (Coleção, Stats, Reviews)",
                    "Timeline de Reviews com integração ao seu cofre",
                    "Busca Mobile Otimizada e Header Inteligente"
                ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-300 font-medium">
                    <ChevronRight size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                    {item}
                    </li>
                ))}
                </ul>
            </div>

            <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-3">
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <Rocket size={14} /> Próxima Sprint (v0.3)
                </h3>
                <ul className="space-y-2">
                <li className="text-xs text-neutral-400 leading-relaxed font-medium">
                    <span className="text-white font-bold">Página de Mídia Renovada:</span> Novo layout em abas fluídas (Sobre, Relacionados, Músicas e Técnico).
                </li>
                <li className="text-xs text-neutral-400 leading-relaxed font-medium">
                    <span className="text-white font-bold">Onde Assistir & Rating:</span> Saiba em qual streaming assistir e a classificação indicativa nacional.
                </li>
                <li className="text-xs text-neutral-400 leading-relaxed font-medium">
                    <span className="text-white font-bold">Trilhas Sonoras:</span> Lista de Openings e Endings de animes em formato de player de música.
                </li>
                <li className="text-xs text-neutral-400 leading-relaxed font-medium">
                    <span className="text-white font-bold">Área Técnica:</span> Requisitos de PC para jogos, estúdios de animação e diretores.
                </li>
                </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
                <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                    <input
                    type="checkbox"
                    className="peer hidden"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    />
                    <div className="w-5 h-5 border-2 border-neutral-700 rounded-md peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all" />
                    <CheckCircle2 className="absolute inset-0 text-neutral-950 scale-0 peer-checked:scale-75 transition-transform mx-auto" />
                </div>
                <span className="text-xs text-neutral-500 font-bold group-hover:text-neutral-300 transition-colors">
                    Não mostrar novamente
                </span>
                </label>

                <button
                onClick={handleClose}
                className="w-full sm:w-auto bg-white text-neutral-950 px-8 py-3 rounded-xl font-black text-sm hover:bg-emerald-500 transition-all active:scale-95"
                >
                ENTENDI!
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}