"use client";

import { UserListStatus } from "../types/media-item";

interface SavedBadgeProps {
    type: string;
    status?: string | null;
}

export default function SavedBadge({ type, status }: SavedBadgeProps) {
    if (!status) return null;

    const activeStatus = status as UserListStatus;

    const getStatusLabel = (activeStatus: UserListStatus, mediaType: string) => {
        if (activeStatus === 'IN_PROGRESS') {
            if (mediaType === 'GAME') return 'Jogando';
            if (mediaType === 'MANGA') return 'Lendo';
            return 'Assistindo';
        }
        const map: Record<string, string> = {
            'PLAN_TO_WATCH': 'Na Lista',
            'ON_HOLD': 'Em Pausa',
            'COMPLETED': 'Concluído',
            'DROPPED': 'Dropado'
        };
        return map[activeStatus];
    };

    const getBadgeStyle = (activeStatus: UserListStatus) => {
        switch (activeStatus) {
            case 'IN_PROGRESS': return 'bg-blue-500/80 border-blue-400/50';
            case 'PLAN_TO_WATCH': return 'bg-emerald-500/80 border-emerald-400/50';
            case 'COMPLETED': return 'bg-purple-500/80 border-purple-400/50';
            case 'ON_HOLD': return 'bg-orange-500/80 border-orange-400/50';
            case 'DROPPED': return 'bg-red-500/80 border-red-400/50';
            default: return 'bg-neutral-500/80 border-neutral-400/50';
        }
    };

    return (
        <div
            className={`absolute top-2 right-2 z-20 px-2 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wide text-white rounded-md border shadow-lg backdrop-blur-md transition-transform hover:scale-105 ${getBadgeStyle(activeStatus)}`}
        >
            {getStatusLabel(activeStatus, type)}
        </div>
    );
}