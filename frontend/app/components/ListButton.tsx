"use client";

import { useState, useEffect } from "react";
import { useList } from "../hooks/useList";
import { MediaItem } from "../types/media-item";
import { Bookmark, BookmarkCheck } from "lucide-react";
import ListModal from "./ListModal";

interface ListButtonProps {
    item: MediaItem;
    themeColorBg: string;
}

export default function ListButton({ item, themeColorBg }: ListButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    const { saveItem, removeItem, togglePin, getItemStatus, isPinned } = useList();
    
    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setMounted(true);
        });
        return () => cancelAnimationFrame(frame);
    }, []);

    const currentStatus = getItemStatus(item.id, item.type);
    const pinned = isPinned(item.id, item.type);

    const getStatusLabel = () => {
        if (!currentStatus) return "Adicionar à Lista";
        if (currentStatus === 'IN_PROGRESS') {
            if (item.type === 'GAME') return 'Jogando';
            if (item.type === 'MANGA') return 'Lendo';
            return 'Assistindo';
        }
        const map: Record<string, string> = {
            'PLAN_TO_WATCH': 'Na Lista',
            'ON_HOLD': 'Em Pausa',
            'COMPLETED': 'Concluído',
            'DROPPED': 'Dropado'
        };
        return map[currentStatus];
    };

    if (!mounted) {
        return (
            <button className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${themeColorBg} text-white opacity-50`}>
                <Bookmark className="w-5 h-5" />
                Carregando...
            </button>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl ${
                    currentStatus
                    ? "bg-white text-black"
                    : `${themeColorBg} text-white shadow-emerald-500/20`
                }`}
            >
                {currentStatus ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                {getStatusLabel()}
            </button>

            <ListModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={item}
                currentStatus={currentStatus}
                isPinned={pinned}
                onSave={(status) => saveItem(item, status)}
                onRemove={() => removeItem(item.id, item.type)}
                onTogglePin={() => togglePin(item)}
            />
        </>
    );
}