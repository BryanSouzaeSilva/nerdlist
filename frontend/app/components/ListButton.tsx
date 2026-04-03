"use client";

import { useState } from "react";
import { useList } from "../hooks/useList";
import { MediaItem } from "../types/media-item";
import { Bookmark, BookmarkCheck } from "lucide-react";
import ListModal from "../components/listModal";

interface ListButtonProps {
    item: MediaItem;
    themeColorBg: string;
}

export default function ListButton({ item, themeColorBg }: ListButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { saveItem, removeItem, getItemStatus } = useList();
    
    const currentStatus = getItemStatus(item.id, item.type);

    const getStatusLabel = () => {
        if (!currentStatus) return "Adicionar à Lista";
        if (currentStatus === 'IN_PROGRESS') {
            if (item.type === 'GAME') return 'Jogando';
            if (item.type === 'MANGA') return 'Lendo';
            return 'Assistindo';
        }
        const map = {
            'PLAN_TO_WATCH': 'Tenho Interesse',
            'ON_HOLD': 'Em Pausa',
            'COMPLETED': 'Concluído',
            'DROPPED': 'Dropado'
        };
        return map[currentStatus];
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 ${
                    currentStatus
                    ? "bg-white text-black"
                    : `${themeColorBg} text-white`
                }`}
            >
                {currentStatus ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                {getStatusLabel()}
            </button>

            <ListModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={item}
                currentStatus={currentStatus}
                onSave={(status) => saveItem(item, status)}
                onRemove={() => removeItem(item.id, item.type)}
            />
        </>
    );
}