"use client";

import { X, Star } from "lucide-react";
import { MediaItem, UserListStatus } from "../types/media-item";

interface ListModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: MediaItem;
    currentStatus?: UserListStatus;
    isPinned: boolean;
    onSave: (status: UserListStatus) => void;
    onRemove: () => void;
    onTogglePin: () => void;
}

export default function ListModal({
    isOpen,
    onClose,
    item,
    currentStatus,
    isPinned,
    onSave,
    onRemove,
    onTogglePin
}: ListModalProps) {
    if (!isOpen) return null;

    const getInProgressText = () => {
        if (item.type === 'GAME') return 'Estou Jogando';
        if (item.type === 'MANGA') return 'Estou Lendo';
        return 'Estou Assistindo';
    };

    const categories: { value: UserListStatus; label: string; color: string }[] = [
        { value: 'IN_PROGRESS', label: getInProgressText(), color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
        { value: 'PLAN_TO_WATCH', label: 'Tenho Interesse', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
        { value: 'COMPLETED', label: 'Concluído', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
        { value: 'ON_HOLD', label: 'Em Pausa', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
        { value: 'DROPPED', label: 'Dropado', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-6">
                
                <button onClick={onClose} className="absolute top-5 right-5 text-neutral-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>

                <h3 className="text-xl font-black text-white mb-1 pr-8 truncate">{item.title}</h3>
                <p className="text-xs text-neutral-500 mb-6 uppercase tracking-widest font-bold">Gerir na minha lista</p>

                <div className="mb-6">
                    <button
                        onClick={onTogglePin}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                            isPinned
                            ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-500" 
                            : "border-neutral-800 bg-neutral-950 text-neutral-500 hover:border-neutral-700"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Star size={20} className={isPinned ? "fill-yellow-500" : ""} />
                            <span className="text-sm font-black uppercase tracking-tight">Favorito Absoluto</span>
                        </div>
                        {isPinned && <span className="text-[10px] font-black uppercase bg-yellow-500 text-black px-2 py-0.5 rounded-sm">PINADO</span>}
                    </button>
                    <p className="text-[9px] text-neutral-600 mt-2 px-1 italic">
                        * Só podes ter um favorito por categoria (Filme, Jogo, etc.)
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => {
                                onSave(cat.value);
                                onClose();
                            }}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                                currentStatus === cat.value
                                    ? `border-white/20 bg-white/5 ${cat.color.split(' ')[0]}`
                                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-white'
                            }`}
                        >
                            <span className="text-sm font-bold">{cat.label}</span>
                            {currentStatus === cat.value && <div className={`w-2 h-2 rounded-full ${cat.color.split(' ')[1].replace('/10', '')} shadow-[0_0_8px_currentColor]`} />}
                        </button>
                    ))}
                </div>

                {currentStatus && (
                    <button
                        onClick={() => {
                            onRemove();
                            onClose();
                        }}
                        className="w-full mt-6 py-3 text-[10px] font-black text-neutral-600 hover:text-red-500 uppercase tracking-widest transition-colors"
                    >
                        Remover da coleção
                    </button>
                )}
            </div>
        </div>
    );
}