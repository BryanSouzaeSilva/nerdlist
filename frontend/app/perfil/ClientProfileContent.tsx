"use client";

import { MediaItem, UserListStatus } from "../types/media-item";
import Link from "next/link";
import Image from "next/image";
import { FolderOpen, User, Star, ChevronRight } from "lucide-react";

function ProfileCard({ item }: { item: MediaItem }) {
    const itemType = item?.type || 'MOVIE';
    const isGame = itemType === 'GAME';
    const aspectClass = isGame ? "aspect-video w-48 md:w-64" : "aspect-2/3 w-32 md:w-44";
    const imageUrl = item?.posterUrl || item?.backdropUrl || '';

    return (
        <Link
            href={`/movie/${item?.id}?type=${itemType}&source=${item?.source || ''}`}
            className="group relative flex-none snap-start bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all shadow-xl"
        >
            <div className={`relative ${aspectClass} overflow-hidden`}>
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={item?.title || 'Item'}
                        fill
                        sizes="(max-width: 768px) 250px, 300px"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110 origin-bottom"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[10px] font-medium">
                        Sem Foto
                    </div>
                )}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/90 via-black/40 to-transparent transition-transform duration-500 ease-out group-hover:scale-110 origin-bottom" />
            </div>
            <div className="absolute bottom-0 w-full p-2 md:p-3 pointer-events-none z-10">
                <p className="text-[10px] md:text-xs font-bold text-white truncate drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
                    {item?.title || 'Sem título'}
                </p>
                <p className="text-[8px] md:text-[9px] text-neutral-300 font-semibold uppercase tracking-wider drop-shadow-md">
                    {itemType === 'SERIES' ? 'SÉRIE' : itemType}
                </p>
            </div>
        </Link>
    );
}

interface ClientProfileProps {
    userName: string;
    items: MediaItem[];
    pins: MediaItem[];
}

export default function ClientProfileContent({ userName, items, pins }: ClientProfileProps) {
    const sections: { title: string; status: UserListStatus; color: string }[] = [
        { title: "Em Andamento", status: "IN_PROGRESS", color: "bg-blue-500" },
        { title: "Tenho Interesse", status: "PLAN_TO_WATCH", color: "bg-emerald-500" },
        { title: "Concluídos", status: "COMPLETED", color: "bg-purple-500" },
        { title: "Em Pausa", status: "ON_HOLD", color: "bg-orange-500" },
        { title: "Dropados", status: "DROPPED", color: "bg-red-500" },
    ];

    const mediaTypes = ['MOVIE', 'SERIES', 'ANIME', 'MANGA', 'GAME'];

    return (
        <main className="min-h-screen bg-neutral-950 pt-28 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <header className="bg-linear-to-br from-neutral-900 to-neutral-800 p-8 rounded-3xl border border-neutral-700/50 mb-12 shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="relative group">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-neutral-800 border-4 border-emerald-500/50 flex items-center justify-center shadow-inner overflow-hidden">
                                <User size={50} className="text-emerald-500" />
                            </div>
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded-sm uppercase whitespace-nowrap">
                                Nível 5
                            </span>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-4">{userName}</h1>
                            <div className="w-full max-w-md bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/5">
                                <div className="bg-emerald-500 h-full w-[65%] shadow-[0_0_10px_#10b981]" />
                            </div>
                            <div className="flex justify-between items-center max-w-md mt-2 text-[8px] sm:text-[10px] font-bold text-neutral-500 uppercase tracking-wider sm:tracking-widest">
                                <span className="whitespace-nowrap">650 XP</span>
                                <span className="whitespace-nowrap text-right">
                                    1000 XP <span className="hidden sm:inline">para o Nível 6</span><span className="sm:hidden">p/ Nível 6</span>
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center md:text-right">
                            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
                                <p className="text-2xl font-black text-white leading-none">{items.length}</p>
                                <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">Coleção</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
                                <p className="text-2xl font-black text-emerald-500 leading-none">{pins.length}</p>
                                <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">Pins</p>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="mb-16">
                    <h2 className="text-xs font-black text-neutral-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" /> Favoritos Absolutos
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
                        {mediaTypes.map((type) => {
                            const pinnedItem = pins.find(p => p.type === type);
                            
                            const isGame = type === 'GAME';
                            const sizeClass = isGame ? "aspect-video w-48 md:w-64" : "aspect-2/3 w-32 md:w-44";

                            return pinnedItem ? (
                                <div key={pinnedItem.id} className="flex justify-center flex-none">
                                    <ProfileCard item={pinnedItem} />
                                </div>
                            ) : (
                                <div key={type} className={`${sizeClass} flex-none rounded-xl border-2 border-dashed border-neutral-800 flex flex-col items-center justify-center p-4 text-center`}>
                                    <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center mb-3 text-neutral-700 transition-colors hover:bg-neutral-800 hover:text-neutral-500 cursor-pointer">
                                        <Star size={20} />
                                    </div>
                                    <p className="text-[9px] font-black text-neutral-600 uppercase tracking-tighter mt-2">Pinar {type}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-500 border-2 border-dashed border-neutral-800 rounded-3xl">
                        <FolderOpen size={48} className="mb-4 opacity-20" />
                        <p className="text-lg">Sua lista está vazia.</p>
                        <Link href="/" className="mt-4 text-emerald-500 hover:underline font-bold uppercase text-xs tracking-widest">Explorar catálogo</Link>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {sections.map((section) => {
                            const filteredItems = items.filter(item => item.userListStatus === section.status);
                            if (filteredItems.length === 0) return null;

                            return (
                                <section key={section.status}>
                                    <Link
                                        href={`/perfil/${section.status.toLowerCase()}`}
                                        className="group flex items-center justify-between mb-8 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-1.5 h-8 rounded-full ${section.color}`} />
                                            <h2 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                                                {section.title}
                                                <span className="ml-4 text-sm font-bold text-neutral-600 group-hover:text-neutral-400">
                                                    {filteredItems.length}
                                                </span>
                                            </h2>
                                        </div>
                                        <ChevronRight size={24} className="text-neutral-700 group-hover:text-white group-hover:translate-x-2 transition-all" />
                                    </Link>

                                    <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar snap-x">
                                        {filteredItems.map((item) => (
                                            <ProfileCard key={`${item.type}-${item.id}`} item={item} />
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}