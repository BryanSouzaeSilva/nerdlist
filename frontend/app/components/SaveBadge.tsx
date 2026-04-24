"use client";

import { useState, useEffect } from "react";
import { UserListStatus } from "../types/media-item";
import { getUserList } from "../actions/list";

interface SavedBadgeProps {
    id: number | string;
    type: string;
    initialStatus?: string | null;
}

export default function SavedBadge({ id, type, initialStatus }: SavedBadgeProps) {
    const [fetchedStatus, setFetchedStatus] = useState<UserListStatus | null>(null);

    const activeStatus = initialStatus !== undefined
        ? (initialStatus as UserListStatus | null)
        : fetchedStatus;

    useEffect(() => {
        if (initialStatus !== undefined) return;

        let isSubscribed = true;

        const fetchStatus = async () => {
            try {
                const { items } = await getUserList();
                if (!isSubscribed) return;

                const existingItem = items.find(
                    (i) => String(i.mediaId) === String(id) && i.type === type
                );

                if (existingItem) {
                    setFetchedStatus(existingItem.status as UserListStatus);
                }
            } catch (error) {
                console.error("Erro ao carregar badge:", error);
            }
        };

        fetchStatus();

        return () => {
            isSubscribed = false;
        };
    }, [id, type, initialStatus]);

    if (!activeStatus) return null;

    const getStatusLabel = (status: UserListStatus, mediaType: string) => {
        if (status === 'IN_PROGRESS') {
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
        return map[status];
    };

    const getBadgeStyle = (status: UserListStatus) => {
        switch (status) {
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