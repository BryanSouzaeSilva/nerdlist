"use client";

import { X } from "lucide-react";
import { MediaItem, UserListStatus } from "../types/media-item";

interface ListModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: MediaItem;
    currentStatus?: UserListStatus;
    onSave: (status: UserListStatus) => void;
    onRemove: () => void;
}

export default function ListModal({ isOpen, onClose, item, currentStatus, onSave, onRemove }: ListModalProps) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity">
            <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
                
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-white mb-1 pr-8 truncate">{item.title}</h3>
                <p className="text-sm text-neutral-400 mb-6">Escolhe uma lista para guardar</p>

                <div className="flex flex-col gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => {
                                onSave(cat.value);
                                onClose();
                            }}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${
                                currentStatus === cat.value
                                    ? `border-white/50 bg-white/5 ${cat.color.split(' ')[0]}` // Destaca a selecionada
                                    : 'border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800'
                            }`}
                        >
                            <span className="font-medium">{cat.label}</span>
                            {currentStatus === cat.value && <div className={`w-2 h-2 rounded-full ${cat.color.split(' ')[1].replace('/10', '')}`} />}
                        </button>
                    ))}
                </div>

                {currentStatus && (
                    <button
                        onClick={() => {
                            onRemove();
                            onClose();
                        }}
                        className="w-full mt-6 py-3 text-sm font-semibold text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        Remover da minha lista
                    </button>
                )}
            </div>
        </div>
    );
}