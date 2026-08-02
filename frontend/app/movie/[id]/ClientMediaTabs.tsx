"use client";

import React from "react";
import { useState } from "react";
import { Info, Link as LinkIcon, Music, Cpu, MessageSquare, Star, PlayCircle } from "lucide-react";import Image from "next/image";
import TrailerPlayer from "@/app/components/TrailerPlayer";
import ReviewForm from "@/app/components/ReviewForm";
import { ExtendedMediaItem } from "./page";

interface CastMember {
    id: number;
    name: string;
    character: string;
    profileUrl: string | null;
}

interface ReviewWithUser {
    id: string;
    userId: string;
    rating: number;
    comment: string | null;
    user: {
        name: string | null;
        image: string | null;
    };
}

interface ClientMediaTabsProps {
    data: ExtendedMediaItem;
    cast: CastMember[];
    reviews: ReviewWithUser[];
    trailerUrl: string | null;
    mediaId: string;
    mediaType: "MOVIE" | "SERIE" | "ANIME" | "GAME" | "MANGA";
    themeColorBg: string;
}

export default function ClientMediaTabs({ data, cast, reviews, trailerUrl, mediaId, mediaType, themeColorBg }: ClientMediaTabsProps) {
    const [activeTab, setActiveTab] = useState("SOBRE");

    const tabs = [
        { id: "SOBRE", label: "Sobre", icon: Info },
        { id: "RELACIONADOS", label: "Relacionados", icon: LinkIcon },
        { id: "MUSICAS", label: "Músicas", icon: Music },
        { id: "TECNICO", label: "Técnico", icon: Cpu },
        { id: "AVALIACOES", label: "Avaliações", icon: MessageSquare },
    ];

    return (
        <div>
            {/* Barra de Abas */}
            <nav className="flex flex-wrap gap-3 md:gap-4 border-b border-white/5 pb-6 mb-10">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black transition-all whitespace-nowrap ${
                                isActive
                                ? "bg-white text-neutral-950 scale-105 shadow-lg"
                                : "text-gray-500 hover:text-white bg-neutral-900/50"
                            }`}
                        >
                            <Icon size={16} />
                            <span className="text-xs md:text-sm">{tab.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Conteúdo Dinâmico */}
            <div className="space-y-12 min-h-100 animate-in fade-in duration-500">
                
                {/* --- ABA 1: SOBRE --- */}
                {activeTab === "SOBRE" && (
                    <div className="space-y-12">
                        {/* Sinopse */}
                        <div className="max-w-3xl">
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white flex items-center gap-3">
                                <span className={`w-1.5 h-6 rounded-full ${themeColorBg}`} />
                                Sinopse
                            </h2>
                            <p className="text-gray-400 leading-relaxed text-base md:text-lg text-justify font-light">
                                {data.synopsis || "Nenhuma sinopse disponível."}
                            </p>
                        </div>

                        {/* Onde Assistir / Onde Comprar */}
                        {data.watchProviders && data.watchProviders.length > 0 ? (
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl max-w-4xl">
                                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                                    {mediaType === 'GAME' ? 'Onde Comprar / Plataformas' : 'Disponível em'}
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {data.watchProviders.map((provider) => (
                                        provider.logoPath ? (
                                            <div
                                                key={provider.providerId}
                                                className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shadow-lg border border-white/10 group bg-neutral-900" 
                                                title={provider.name}
                                            >
                                                <Image
                                                    src={provider.logoPath}
                                                    alt={provider.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        ) : (
                                            <span
                                                key={provider.providerId}
                                                className="px-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs font-bold text-gray-200 shadow-md"
                                            >
                                                {provider.name}
                                            </span>
                                        )
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl border-dashed max-w-4xl">
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                                    {mediaType === 'GAME' ? 'Onde Comprar' : 'Onde Assistir'}
                                </h3>
                                <p className="text-sm text-gray-500 italic">
                                    {mediaType === 'GAME'
                                        ? 'Informações de lojas virtuais indisponíveis para este título.'
                                        : 'Provedores de streaming não encontrados para a sua região.'}
                                </p>
                            </div>
                        )}

                        {/* Trailer Oficial */}
                        {trailerUrl && (
                            <div className="max-w-4xl pt-8 border-t border-white/5">
                                <h2 className="text-xl md:text-2xl font-bold mb-6 text-white flex items-center gap-3">
                                    <span className={`w-1.5 h-6 rounded-full ${themeColorBg}`} />
                                    Trailer Oficial
                                </h2>
                                <TrailerPlayer videoId={trailerUrl} />
                            </div>
                        )}

                        {/* Elenco Principal */}
                        {cast && cast.length > 0 && (
                            <div className="pt-8 border-t border-white/5">
                                <h2 className="text-xl md:text-2xl font-bold mb-6 text-white flex items-center gap-3">
                                    <span className={`w-1.5 h-6 rounded-full ${themeColorBg}`} />
                                    Elenco Principal
                                </h2>
                                <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth custom-scrollbar">
                                    {cast.map((actor) => (
                                        <div key={actor.id} className="flex-none w-28 md:w-40 text-center group snap-start">
                                            <div className="relative w-full aspect-3/4 rounded-xl overflow-hidden mb-3 border border-white/5 group-hover:border-white/20 transition-all duration-300 shadow-lg">
                                                {actor.profileUrl ? (
                                                    <Image src={actor.profileUrl} alt={actor.name} fill className="object-cover" sizes="(max-width: 768px) 112px, 160px" />
                                                ) : (
                                                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-gray-500 text-[10px] italic">Sem Foto</div>
                                                )}
                                            </div>
                                            <p className="text-xs md:text-sm font-bold text-white truncate px-1">{actor.name}</p>
                                            <p className="text-[10px] md:text-xs text-gray-500 truncate px-1 mt-0.5">{actor.character}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- ABA 2: RELACIONADOS --- */}
                {activeTab === "RELACIONADOS" && (
                    <div className="space-y-6">
                        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                            <span className={`w-1.5 h-6 rounded-full ${themeColorBg}`} />
                            Obras Relacionadas e Recomendadas
                        </h2>

                        {data.similar && data.similar.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                                {data.similar.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`/movie/${item.id}?type=${item.type || mediaType}`}
                                        className="group relative bg-neutral-900 rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 shadow-lg flex flex-col"
                                    >
                                        <div className="relative w-full aspect-2/3 bg-neutral-800">
                                            {item.posterUrl ? (
                                                <Image
                                                    src={item.posterUrl}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    sizes="(max-width: 768px) 50vw, 20vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs italic">
                                                    Sem Capa
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3 flex-1 flex flex-col justify-between">
                                            <h3 className="text-xs md:text-sm font-bold text-white line-clamp-2 group-hover:text-emerald-400 transition-colors">
                                                {item.title}
                                            </h3>
                                            {item.rating && item.rating > 0 ? (
                                                <span className="text-[10px] md:text-xs text-green-400 font-bold mt-2">
                                                    ★ {Number(item.rating).toFixed(1)}
                                                </span>
                                            ) : null}
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white/5 border border-white/5 p-8 rounded-2xl text-center space-y-2 max-w-xl mx-auto my-12">
                                <p className="text-gray-400 font-medium">Nenhum título relacionado encontrado.</p>
                                <p className="text-xs text-gray-500">Esta obra não possui sequências ou recomendações mapeadas na base de dados.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* --- ABA 3: MÚSICAS --- */}
                {activeTab === "MUSICAS" && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3 mb-6">
                            <span className={`w-1.5 h-6 rounded-full ${themeColorBg}`} />
                            Trilha Sonora Oficial
                        </h2>

                        {data.songs && (data.songs.openings.length > 0 || data.songs.endings.length > 0) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Openings */}
                                {data.songs.openings.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                            <Music size={16} /> Aberturas (Openings)
                                        </h3>
                                        <ul className="space-y-3">
                                            {data.songs.openings.map((op, idx) => (
                                                <li key={idx} className="bg-neutral-900/50 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-white/20 hover:bg-neutral-900 transition-all shadow-sm">
                                                    <span className="text-sm text-gray-300 truncate pr-4">{op}</span>
                                                    <a 
                                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(op)}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-gray-500 group-hover:text-emerald-400 transition-colors"
                                                        title="Buscar no YouTube"
                                                    >
                                                        <PlayCircle size={20} />
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                {/* Endings */}
                                {data.songs.endings.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-purple-500 uppercase tracking-widest flex items-center gap-2">
                                            <Music size={16} /> Encerramentos (Endings)
                                        </h3>
                                        <ul className="space-y-3">
                                            {data.songs.endings.map((ed, idx) => (
                                                <li key={idx} className="bg-neutral-900/50 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-white/20 hover:bg-neutral-900 transition-all shadow-sm">
                                                    <span className="text-sm text-gray-300 truncate pr-4">{ed}</span>
                                                    <a 
                                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ed)}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-gray-500 group-hover:text-purple-400 transition-colors"
                                                        title="Buscar no YouTube"
                                                    >
                                                        <PlayCircle size={20} />
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-neutral-900/30 border border-white/5 p-8 md:p-12 rounded-3xl flex flex-col items-center justify-center text-center space-y-6 max-w-3xl mx-auto my-8">
                                <div className={`w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center border border-white/10 shadow-xl`}>
                                    <Music className="text-gray-400" size={32} />
                                </div>
                                <div>
                                    <p className="text-white font-black text-xl md:text-2xl mb-3">Escute a Trilha Sonora Original</p>
                                    <p className="text-base text-gray-500 max-w-lg mx-auto leading-relaxed">
                                        Mergulhe no universo de <strong>{data.title}</strong> buscando a trilha sonora oficial completa (OST) diretamente nas suas plataformas favoritas.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                                    <a
                                        href={`https://open.spotify.com/search/${encodeURIComponent(data.title + ' soundtrack OST')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 px-8 py-4 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(29,185,84,0.3)]"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.121c-.6.18-1.2-.12-1.38-.72-.18-.6.12-1.2.72-1.38 4.26-1.02 11.28-.72 15.72 1.62.539.3.719 1.02.419 1.56-.299.48-1.02.6-1.56.3z"/></svg>
                                        Spotify
                                    </a>
                                    <a
                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(data.title + ' soundtrack OST')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 px-8 py-4 bg-[#FF0000] hover:bg-[#ff4d4d] text-white font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                                    >
                                        <PlayCircle size={20} />
                                        YouTube
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- ABA 4: TÉCNICO --- */}
                {activeTab === "TECNICO" && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3 mb-6">
                            <span className={`w-1.5 h-6 rounded-full ${themeColorBg}`} />
                            Ficha Técnica e Especificações
                        </h2>

                        {data.technical ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* Estúdios / Desenvolvedoras */}
                                {((data.technical.studios && data.technical.studios.length > 0) || (data.technical.developers && data.technical.developers.length > 0)) && (
                                    <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl">
                                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Estúdio / Desenvolvedora</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {(data.technical.studios || data.technical.developers || []).map((name, i) => (
                                                <span key={i} className="px-3 py-1 bg-white/10 border border-white/5 rounded-lg text-sm text-white font-medium shadow-sm">{name}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Status */}
                                {data.technical.status && (
                                    <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl">
                                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Status de Lançamento</h3>
                                        <p className="text-lg text-white font-bold">{data.technical.status}</p>
                                    </div>
                                )}

                                {/* Temas e Demografia (Animes) */}
                                {((data.technical.themes && data.technical.themes.length > 0) || (data.technical.demographics && data.technical.demographics.length > 0)) && (
                                    <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl md:col-span-2">
                                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Temáticas e Demografia</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {data.technical.demographics?.map((name, i) => (
                                                <span key={`demo-${i}`} className="px-4 py-1.5 border border-purple-500/30 bg-purple-500/10 text-purple-400 rounded-xl text-sm font-black shadow-sm">{name}</span>
                                            ))}
                                            {data.technical.themes?.map((name, i) => (
                                                <span key={`theme-${i}`} className="px-4 py-1.5 border border-white/10 bg-white/5 text-gray-300 rounded-xl text-sm font-medium">{name}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* PC Specs (Jogos) */}
                                {data.technical.pcRequirements && (data.technical.pcRequirements.minimum || data.technical.pcRequirements.recommended) && (
                                    <div className="md:col-span-2 space-y-4 mt-6">
                                        <h3 className="text-emerald-500 text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-4">
                                            <Cpu size={18} /> Requisitos de Sistema (PC)
                                        </h3>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {data.technical.pcRequirements.minimum && (
                                                <div className="bg-neutral-900 border border-white/5 p-6 md:p-8 rounded-2xl shadow-lg">
                                                    <h4 className="text-gray-400 font-black mb-4 border-b border-white/5 pb-3 uppercase tracking-wider text-xs">Requisitos Mínimos</h4>
                                                    <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-mono">
                                                        {data.technical.pcRequirements.minimum.replace(/Minimum:/g, '').trim()}
                                                    </p>
                                                </div>
                                            )}
                                            {data.technical.pcRequirements.recommended && (
                                                <div className="bg-neutral-900 border border-white/5 p-6 md:p-8 rounded-2xl shadow-lg">
                                                    <h4 className="text-emerald-500 font-black mb-4 border-b border-white/5 pb-3 uppercase tracking-wider text-xs">Requisitos Recomendados</h4>
                                                    <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-mono">
                                                        {data.technical.pcRequirements.recommended.replace(/Recommended:/g, '').trim()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-neutral-900/30 border border-white/5 p-8 rounded-2xl text-center">
                                <Cpu className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400 font-medium">Informações técnicas não disponíveis.</p>
                                <p className="text-xs text-gray-500 mt-2">Os dados detalhados para esta mídia não foram encontrados no banco de dados.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* --- ABA 5: AVALIAÇÕES --- */}
                {activeTab === "AVALIACOES" && (
                    <div className="space-y-8">
                        <ReviewForm mediaId={mediaId} type={mediaType} />
                        <div className="mt-12 space-y-6">
                            <h3 className="text-2xl font-black text-white flex items-center gap-2">
                                <MessageSquare className="w-6 h-6 text-emerald-500 fill-emerald-500" />
                                Comentários da Comunidade
                            </h3>
                            {reviews.length === 0 ? (
                                <p className="text-gray-500 italic">Ninguém avaliou ainda. Seja o primeiro!</p>
                            ) : (
                                <div className="grid gap-4">
                                    {reviews.map((rev) => (
                                        <div key={rev.id} className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="relative w-10 h-10 bg-neutral-800 rounded-full overflow-hidden border border-white/10">
                                                    {rev.user.image ? (
                                                        <Image src={rev.user.image} alt={rev.user.name || 'Avatar'} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold uppercase">{rev.user.name?.charAt(0)}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">{rev.user.name}</p>
                                                    <div className="flex gap-1 text-emerald-500">
                                                        {Array.from({ length: rev.rating }).map((_, i) => (
                                                            <Star key={i} className="w-3 h-3 fill-current" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-300 leading-relaxed">{rev.comment || "Sem comentário."}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}