"use client";

import { useState } from "react";
import { MediaItem } from "../../types/media-item";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, FolderOpen, Filter } from "lucide-react";

const STATUS_MAP: Record<string, { value: string, title: string, color: string }> = {
    'in_progress': { value: 'IN_PROGRESS', title: 'Em Andamento', color: 'bg-blue-500' },
    'plan_to_watch': { value: 'PLAN_TO_WATCH', title: 'Tenho Interesse', color: 'bg-emerald-500' },
    'completed': { value: 'COMPLETED', title: 'Concluídos', color: 'bg-purple-500' },
    'on_hold': { value: 'ON_HOLD', title: 'Em Pausa', color: 'bg-orange-500' },
    'dropped': { value: 'DROPPED', title: 'Dropados', color: 'bg-red-500' },
};

function ProfileCard({ item }: { item: MediaItem }) {
    const itemType = item?.type || 'MOVIE';
    const isGame = itemType === 'GAME';
    
    const aspectClass = isGame ? "aspect-video" : "aspect-2/3";
    const imageUrl = item?.posterUrl || item?.backdropUrl || '';

    return (
        <Link
            href={`/movie/${item?.id}?type=${itemType}&source=${item?.source || ''}`}
            className="group relative flex-none bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 hover:border-emerald-500/50 transition-all shadow-xl block w-full h-full"
        >
            <div className={`relative ${aspectClass} w-full overflow-hidden`} style={{ position: 'relative' }}>
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={item?.title || 'Item'}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110 origin-bottom"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[10px] font-medium bg-neutral-900">
                        Sem Foto
                    </div>
                )}
                
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/95 via-black/40 to-transparent transition-transform duration-500 ease-out group-hover:scale-110 origin-bottom" />
            </div>
            
            <div className="absolute bottom-0 w-full p-2 md:p-3 pointer-events-none z-10">
                <p className="text-[10px] md:text-xs font-bold text-white truncate drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
                    {item?.title || 'Sem título'}
                </p>
                <p className="text-[8px] md:text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                    {itemType === 'SERIES' ? 'SÉRIE' : itemType}
                </p>
            </div>
        </Link>
    );
}

interface ClientStatusProps {
    items: MediaItem[];
    urlStatus: string;
}

export default function ClientStatusContent({ items, urlStatus }: ClientStatusProps) {
    const [activeFilter, setActiveFilter] = useState<string>('ALL');

    const categoryConfig = STATUS_MAP[urlStatus];

    if (!categoryConfig) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white pt-20">
                <h1 className="text-2xl font-black mb-4">Categoria não encontrada</h1>
                <Link href="/perfil" className="text-emerald-500 hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Voltar ao Perfil
                </Link>
            </div>
        );
    }

    const itemsInStatus = items.filter(item => item.userListStatus === categoryConfig.value);

    const sortedItems = [...itemsInStatus].sort((a, b) => {
        if (a.type === 'GAME' && b.type !== 'GAME') return 1;
        if (a.type !== 'GAME' && b.type === 'GAME') return -1;
        return 0;
    });

    const displayItems = sortedItems.filter(item => {
        if (activeFilter === 'ALL') return true;
        return item.type === activeFilter;
    });

    const baseFilters = [
        { id: 'MOVIE', label: 'Filmes' },
        { id: 'SERIES', label: 'Séries' },
        { id: 'ANIME', label: 'Animes' },
        { id: 'MANGA', label: 'Mangás' },
        { id: 'GAME', label: 'Jogos' }
    ];

    const availableFilters = [
        { id: 'ALL', label: 'Todos', count: itemsInStatus.length },
        ...baseFilters.map(filter => ({
            ...filter,
            count: itemsInStatus.filter(i => i.type === filter.id).length
        })).filter(filter => filter.count > 0)
    ];

    return (
        <main className="min-h-screen bg-neutral-950 pt-28 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                
                <Link
                    href="/perfil"
                    className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8 font-bold text-sm uppercase tracking-wider"
                >
                    <div className="p-2 rounded-full bg-neutral-900 border border-neutral-800">
                        <ArrowLeft size={16} />
                    </div>
                    Voltar ao Perfil
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className={`w-2 h-10 rounded-full ${categoryConfig.color} shadow-[0_0_15px_currentColor]`} />
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                                {categoryConfig.title}
                            </h1>
                            <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mt-2">
                                {itemsInStatus.length} {itemsInStatus.length === 1 ? 'Item salvo' : 'Itens salvos'}
                            </p>
                        </div>
                    </div>

                    {itemsInStatus.length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            <Filter size={16} className="text-neutral-600 mr-2 shrink-0" />
                            {availableFilters.map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                                        activeFilter === filter.id
                                        ? 'bg-white text-black border-white'
                                        : 'bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white'
                                    }`}
                                >
                                    {filter.label}
                                    <span className={`px-1.5 py-0.5 rounded-sm text-[8px] ${
                                        activeFilter === filter.id ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-neutral-500'
                                    }`}>
                                        {filter.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {itemsInStatus.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-neutral-500 border-2 border-dashed border-neutral-800 rounded-3xl">
                        <FolderOpen size={48} className="mb-4 opacity-10" />
                        <p className="text-lg font-bold">Nenhum item nesta prateleira.</p>
                        <Link href="/" className="mt-4 px-6 py-2 bg-white text-black text-[10px] font-black uppercase rounded-full hover:scale-105 transition-transform">
                            Explorar catálogo
                        </Link>
                    </div>
                ) : displayItems.length === 0 ? (
                    <div className="text-center py-20 text-neutral-500">
                        Nenhum item correspondente a este filtro.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {displayItems.map((item) => (
                            <div key={`${item.type}-${item.id}`} className="flex justify-center">
                                <ProfileCard item={item} />
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </main>
    );
}