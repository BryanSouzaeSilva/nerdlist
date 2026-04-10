"use client";

import { useState, useTransition } from "react";
import { MediaItem, UserListStatus } from "../types/media-item";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import ListModal from "./ListModal";
import { saveMediaToList, removeMediaFromList, togglePinMedia } from "../actions/list";

interface ListButtonProps {
    item: MediaItem;
    themeColorBg: string;
    initialStatus?: string;
    initialPinned?: boolean;
}

export default function ListButton({ item, themeColorBg, initialStatus, initialPinned }: ListButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [currentStatus, setCurrentStatus] = useState<UserListStatus | null>((initialStatus as UserListStatus) || null);
    const [isPinned, setIsPinned] = useState(initialPinned || false);
    
    const [isPending, startTransition] = useTransition();

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

    const handleSave = (status: string) => {
        startTransition(async () => {
            const mediaData = {
                id: String(item.id),
                type: item.type,
                source: item.source || "TMDB",
                title: item.title,
                posterUrl: item.posterUrl || "",
                backdropUrl: item.backdropUrl || ""
            };
            
            const res = await saveMediaToList(mediaData, status);
            if (res.success) {
                setCurrentStatus(status as UserListStatus);
            }
        });
    };

    const handleRemove = () => {
        startTransition(async () => {
            const res = await removeMediaFromList(String(item.id), item.type);
            if (res.success) {
                setCurrentStatus(null);
                setIsPinned(false);
            }
        });
    };

    const handleTogglePin = () => {
        const newPinStatus = !isPinned;
        setIsPinned(newPinStatus);
        
        startTransition(async () => {
            const res = await togglePinMedia(String(item.id), item.type, newPinStatus);
            if (!res?.success) {
                setIsPinned(!newPinStatus);
            }
        });
    };

    return (
        <>
            <button
                disabled={isPending}
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50 ${
                    currentStatus
                    ? "bg-white text-black"
                    : `${themeColorBg} text-white shadow-emerald-500/20`
                }`}
            >
                {isPending ? <Loader2 size={18} className="animate-spin" /> : currentStatus ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                {getStatusLabel()}
            </button>

            <ListModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={item}
                currentStatus={currentStatus || undefined}
                isPinned={isPinned}
                onSave={handleSave}
                onRemove={handleRemove}
                onTogglePin={handleTogglePin}
            />
        </>
    );
}