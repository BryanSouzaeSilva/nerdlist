"use client";

import { useState } from "react";
import { MediaItem, UserListStatus } from "../types/media-item";
import Link from "next/link";
import Image from "next/image";
import { 
    FolderOpen, User, ChevronRight, 
    LayoutGrid, BarChart3, MessageSquare, 
    ListOrdered, Star, Award 
} from "lucide-react";

// --- Componente de Card de Mídia ---
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
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[10px] font-medium uppercase">
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

interface ReviewData {
    id: string;
    mediaId: string;
    type: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
}

interface ClientProfileProps {
    userName: string;
    items: MediaItem[];
    pins: MediaItem[];
    reviews: ReviewData[];
}

export default function ClientProfileContent({ userName, items, pins, reviews }: ClientProfileProps) {
    const [activeTab, setActiveTab] = useState("COLLECTION");

    // --- LÓGICA DE ESTATÍSTICAS ---
    const totalMedia = items.length;
    const completedCount = items.filter(i => i.userListStatus === 'COMPLETED').length;
    const completionRate = totalMedia > 0 ? Math.round((completedCount / totalMedia) * 100) : 0;
    
    const statsByType = {
        MOVIE: items.filter(i => i.type === 'MOVIE').length,
        SERIES: items.filter(i => i.type === 'SERIES').length,
        ANIME: items.filter(i => i.type === 'ANIME').length,
        MANGA: items.filter(i => i.type === 'MANGA').length,
        GAME: items.filter(i => i.type === 'GAME').length,
    };

    const favoriteType = totalMedia > 0 
        ? Object.entries(statsByType).reduce((a, b) => a[1] >= b[1] ? a : b)[0] 
        : "N/A";

    const sections: { title: string; status: UserListStatus; color: string }[] = [
        { title: "Em Andamento", status: "IN_PROGRESS", color: "bg-blue-500" },
        { title: "Tenho Interesse", status: "PLAN_TO_WATCH", color: "bg-emerald-500" },
        { title: "Concluídos", status: "COMPLETED", color: "bg-purple-500" },
        { title: "Em Pausa", status: "ON_HOLD", color: "bg-orange-500" },
        { title: "Dropados", status: "DROPPED", color: "bg-red-500" },
    ];

    const tabs = [
        { id: "COLLECTION", label: "Coleção", icon: LayoutGrid },
        { id: "STATS", label: "Estatísticas", icon: BarChart3 },
        { id: "REVIEWS", label: "Reviews", icon: MessageSquare },
        { id: "TIERLISTS", label: "TierLists", icon: ListOrdered },
    ];

    const mediaTypes = ['MOVIE', 'SERIES', 'ANIME', 'MANGA', 'GAME'];

    return (
        <main className="min-h-screen bg-neutral-950 pt-28 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                
                {/* --- ÁREA FIXA: CABEÇALHO --- */}
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

                        {/* CONTADORES (Sem Moedas/Estrelas) */}
                        <div className="grid grid-cols-2 gap-4 text-center md:text-right">
                            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center min-w-[80px]">
                                <p className="text-2xl font-black text-white leading-none">{items.length}</p>
                                <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">Coleção</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center min-w-[80px]">
                                <p className="text-2xl font-black text-emerald-500 leading-none">{pins.length}</p>
                                <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">Pins</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- SELETOR DE ABAS: Ajustado para Mobile (Grid 2x2) --- */}
                <nav className="grid grid-cols-2 md:flex md:justify-start gap-3 md:gap-4 border-b border-white/5 pb-6 mb-10">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center justify-center md:justify-start gap-2 px-4 md:px-6 py-3 rounded-xl font-black transition-all whitespace-nowrap ${
                                    isActive
                                    ? "bg-white text-neutral-950 scale-105 shadow-lg"
                                    : "text-gray-500 hover:text-white bg-neutral-900/50 md:bg-transparent"
                                }`}
                            >
                                <Icon size={18} />
                                <span className="text-xs md:text-sm">{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="min-h-100">
                    
                    {/* --- CONTEÚDO: COLEÇÃO --- */}
                    {activeTab === "COLLECTION" && (
                        <>
                            <section className="mb-16">
                                <h2 className="text-xs font-black text-neutral-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <Award size={14} className="text-yellow-500" /> Favoritos Absolutos
                                </h2>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8">
                                    {mediaTypes.map((type) => {
                                        const pinnedItem = pins.find(p => p.type === type);
                                        const isGame = type === 'GAME';
                                        const sizeClass = isGame ? "aspect-video w-48 md:w-64" : "aspect-2/3 w-32 md:w-44";

                                        return pinnedItem ? (
                                            <ProfileCard key={pinnedItem.id} item={pinnedItem} />
                                        ) : (
                                            <div key={type} className={`${sizeClass} rounded-xl border-2 border-dashed border-neutral-800 flex flex-col items-center justify-center p-4 text-center opacity-40`}>
                                                <Award size={20} className="text-neutral-700 mb-2" />
                                                <p className="text-[8px] font-black text-neutral-600 uppercase tracking-tighter mt-2">Pinar {type}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            <div className="space-y-16">
                                {sections.map((section) => {
                                    const filteredItems = items.filter(item => item.userListStatus === section.status);
                                    if (filteredItems.length === 0) return null;

                                    return (
                                        <section key={section.status}>
                                            <div className="flex items-center justify-between mb-8 group cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-1.5 h-8 rounded-full ${section.color}`} />
                                                    <h2 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                                                        {section.title}
                                                        <span className="ml-4 text-sm font-bold text-neutral-600">
                                                            {filteredItems.length}
                                                        </span>
                                                    </h2>
                                                </div>
                                                <ChevronRight size={24} className="text-neutral-700 group-hover:text-white group-hover:translate-x-2 transition-all" />
                                            </div>

                                            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar snap-x">
                                                {filteredItems.map((item) => (
                                                    <ProfileCard key={`${item.type}-${item.id}`} item={item} />
                                                ))}
                                            </div>
                                        </section>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* --- CONTEÚDO: ESTATÍSTICAS --- */}
                    {activeTab === "STATS" && (
                        <div className="space-y-12 animate-in fade-in duration-500">
                            <h2 className="text-xs font-black text-neutral-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                <BarChart3 size={14} className="text-emerald-500" /> NerdReport Geral
                            </h2>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-3xl">
                                    <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-1">Total de Mídias</p>
                                    <p className="text-3xl font-black text-white">{totalMedia}</p>
                                </div>
                                <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-3xl">
                                    <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-1">Taxa de Conclusão</p>
                                    <p className="text-3xl font-black text-emerald-500">{completionRate}%</p>
                                </div>
                                <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-3xl">
                                    <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-1">Favorito do Perfil</p>
                                    <p className="text-lg font-black text-white uppercase">{favoriteType === 'MOVIE' ? 'Filmes' : favoriteType === 'GAME' ? 'Jogos' : favoriteType}</p>
                                </div>
                                <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-3xl">
                                    <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-1">Reviews Escritas</p>
                                    <p className="text-3xl font-black text-white">{reviews.length}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-neutral-900/50 border border-white/5 p-8 rounded-3xl space-y-6">
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Distribuição por Categoria</h3>
                                    <div className="space-y-4">
                                        {Object.entries(statsByType).map(([type, count]) => {
                                            const percent = totalMedia > 0 ? (count / totalMedia) * 100 : 0;
                                            const colors: Record<string, string> = {
                                                MOVIE: 'bg-emerald-500',
                                                SERIES: 'bg-blue-500',
                                                ANIME: 'bg-purple-500',
                                                MANGA: 'bg-orange-500',
                                                GAME: 'bg-red-500'
                                            };
                                            return (
                                                <div key={type} className="space-y-1.5">
                                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                                                        <span className="text-neutral-400">{type}</span>
                                                        <span className="text-white">{count} itens ({Math.round(percent)}%)</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${colors[type] || 'bg-emerald-500'} transition-all duration-1000`} 
                                                            style={{ width: `${percent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Card de Conquista Rápida (Crítico em Ascensão) */}
                                <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl flex flex-col justify-center items-center text-center">
                                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                        <MessageSquare className="text-emerald-500" size={32} />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-2">Crítico em Ascensão</h3>
                                    <p className="text-neutral-400 text-sm max-w-xs">
                                        Você já avaliou <span className="text-white font-bold">{reviews.length}</span> obras diferentes. Continue compartilhando sua visão para subir de nível!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "REVIEWS" && (
                        <div className="max-w-4xl mx-auto space-y-6">
                            <h2 className="text-xs font-black text-neutral-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                <MessageSquare size={14} className="text-emerald-500" /> Sua Linha do Tempo
                            </h2>

                            {reviews.length === 0 ? (
                                <div className="text-center py-20 bg-neutral-900/30 rounded-3xl border border-dashed border-neutral-800">
                                    <p className="text-neutral-500 italic">Você ainda não escreveu nenhuma crítica.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {reviews.map((review) => {
                                        const mediaInfo = items.find(i => String(i.id) === review.mediaId);
                                        return (
                                            <div key={review.id} className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl flex gap-6 hover:border-emerald-500/20 transition-all group">
                                                <div className="relative w-20 h-28 flex-none bg-neutral-800 rounded-lg overflow-hidden border border-white/5">
                                                    {mediaInfo?.posterUrl ? (
                                                        <Image src={mediaInfo.posterUrl} alt="" fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-700 font-bold uppercase tracking-tighter text-center px-1">
                                                            {review.type}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                        <h3 className="font-black text-white text-lg group-hover:text-emerald-400 transition-colors leading-tight">
                                                            {mediaInfo?.title || `Mídia #${review.mediaId}`}
                                                        </h3>
                                                        <div className="flex gap-1 text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10 w-fit">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star key={i} size={12} className={i < review.rating ? "fill-current" : "text-neutral-800"} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-neutral-400 text-sm leading-relaxed italic">&quot;{review.comment || "Sem comentário."}&quot;</p>
                                                    <span className="block text-[10px] font-black text-neutral-600 uppercase tracking-widest pt-2">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "TIERLISTS" && (
                        <div className="bg-neutral-900/50 p-12 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                            <ListOrdered size={48} className="text-emerald-500 opacity-20" />
                            <h3 className="font-bold text-xl text-white">TierLists em breve</h3>
                            <p className="text-gray-500 text-sm max-w-xs">Organize seus favoritos em rankings definitivos.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}