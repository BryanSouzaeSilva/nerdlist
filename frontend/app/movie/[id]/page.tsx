import React from "react";
import Image from "next/image";
import BackButton from "@/app/components/BackButton";
import ListButton from "@/app/components/ListButton";
import { auth } from "@/auth";
import { getMovieById } from "@/app/services/api";
import { checkItemStatus } from "@/app/actions/list";
import { getMediaReviews } from "@/app/actions/review";
import ClientMediaTabs from "./ClientMediaTabs";
import { MediaItem } from "@/app/types/media-item";

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

// Estendemos a interface para o Front aceitar as novas variáveis do Backend
export type ExtendedMediaItem = MediaItem & {
    ageRating?: string;
    watchProviders?: { providerId: number; name: string; logoPath: string }[];
    synopsis?: string | null;
    rating?: number;
    similar?: {
        id: number | string;
        title: string;
        type: string;
        posterUrl: string;
        releaseDate?: string;
        rating?: number;
    }[];
    // --- ADICIONE ESTAS LINHAS ---
    songs?: {
        openings: string[];
        endings: string[];
    };
    technical?: {
        studios?: string[],
        demographics?: string[],
        themes?: string[],
        pcRequirements?: { minimum?: string; recommended?: string },
        developers?: string[],
        publishers?: string[],
        status?: string[],
    }
};

interface MoviePageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ type?: string; source?: string }>;
}

export default async function MoviePage(props: MoviePageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const session = await auth();

    const type = (searchParams.type || 'MOVIE') as "MOVIE" | "SERIE" | "ANIME" | "GAME" | "MANGA";
    const source = searchParams.source || '';

    // Convertendo a resposta para a nossa interface estendida
    const data = await getMovieById(params.id, type, source) as unknown as ExtendedMediaItem;
    const initialData = session?.user ? await checkItemStatus(params.id, type) : null;
    const reviews = ((await getMediaReviews(params.id, type)) || []) as ReviewWithUser[];

    const cast = data.cast || [];
    const trailerUrl = data.trailerUrl || null;
    const imageUrl = data.backdropUrl || data.posterUrl;

    const isGame = type === 'GAME';
    const themeColorBg = isGame ? "bg-red-500" : type === 'SERIE' ? "bg-blue-500" : type === 'ANIME' ? "bg-purple-500" : type === 'MANGA' ? "bg-orange-500" : "bg-emerald-500";
    const themeColorText = isGame ? "text-red-400" : type === 'SERIE' ? "text-blue-400" : type === 'ANIME' ? "text-purple-400" : type === 'MANGA' ? "text-orange-400" : "text-emerald-400";

    const posterContainerClass = isGame
        ? "relative w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.3)] border-2 border-red-500/30"
        : "relative w-40 md:w-64 aspect-2/3 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border-2 border-neutral-700/50";

    // Função auxiliar para pintar a Classificação Indicativa igual no Brasil
    const getAgeRatingColor = (rating?: string) => {
        if (!rating) return 'bg-neutral-800 text-neutral-400 border-neutral-700';
        const r = rating.toUpperCase();
        if (r === 'L' || r === 'LIVRE') return 'bg-green-500 text-white border-green-600';
        if (r === '10') return 'bg-blue-500 text-white border-blue-600';
        if (r === '12') return 'bg-yellow-500 text-neutral-950 border-yellow-600';
        if (r === '14') return 'bg-orange-500 text-neutral-950 border-orange-600';
        if (r === '16') return 'bg-red-600 text-white border-red-700';
        if (r === '18') return 'bg-black text-white border-neutral-700';
        return 'bg-neutral-800 text-gray-300 border-neutral-600'; // Default
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-gray-100 pb-20">
            {/* Imagem de Fundo (Backdrop) */}
            <div className="relative w-full h-[85vh] md:h-[75vh] overflow-hidden">
                <div className="absolute inset-0">
                    {imageUrl && (
                        <Image
                            src={imageUrl}
                            alt={data.title}
                            fill
                            className="object-cover opacity-30"
                            priority
                        />
                    )}
                    <div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-neutral-950 from-5% via-neutral-950/40 to-transparent translate-y-12" />
                </div>

                {/* Bloco Fixo Circulado Inteiramente Preservado */}
                <div className="absolute bottom-0 left-0 w-full z-10">
                    <div className={`max-w-7xl mx-auto px-8 md:px-12 pb-12 flex flex-col ${isGame ? "items-start" : "md:flex-row md:items-end"} gap-6 md:gap-8`}>
                        
                        <div className={posterContainerClass}>
                            {data.posterUrl && (
                                <Image
                                    src={data.posterUrl}
                                    alt={`Capa de ${data.title}`}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>

                        <div className="flex-1 space-y-3 md:space-y-4">
                            <BackButton colorClass={themeColorText} />

                            <h1 className="text-3xl md:text-6xl font-black tracking-tight text-white drop-shadow-lg leading-tight">
                                {data.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-base text-gray-200">
                                {data.rating && (
                                    <span className="flex items-center gap-1 text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
                                        ★ {Number(data.rating).toFixed(1)}
                                    </span>
                                )}
                                <span>•</span>
                                <span>{data.releaseDate?.split("-")[0] || "2026"}</span>
                                <span>•</span>
                                <span>
                                    {data.extend?.value || "110"} {
                                        data.extend?.unit === 'MINUTES' ? 'Min' :
                                        data.extend?.unit === 'CHAPTERS' ? 'Cap' :
                                        data.extend?.unit === 'HOURS' ? 'Horas' : 'Min'
                                    }
                                </span>
                                <span>•</span>
                                <span className={`px-2 py-0.5 rounded border font-medium bg-white/5 border-white/10 ${themeColorText}`}>
                                    {type === 'SERIE' ? 'Série' : type === 'GAME' ? 'Jogo' : type === 'ANIME' ? 'Anime' : type === 'MANGA' ? 'Mangá' : 'Filme'}
                                </span>
                                
                                {/* Classificação Indicativa agora é Dinâmica */}
                                {data.ageRating && (
                                    <>
                                        <span>•</span>
                                        <span className={`px-2 py-0.5 rounded font-black text-xs shadow-sm border ${getAgeRatingColor(data.ageRating)}`}>
                                            {data.ageRating}
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                                {data.genres?.map((genre: string) => (
                                    <span
                                        key={genre}
                                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] md:text-xs text-gray-300"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>

                            {session?.user && (
                                <div className="flex flex-wrap items-center gap-6 pt-2">
                                    <ListButton
                                        item={{
                                            id: data.id, // Mantido como number original (removido o .toString())
                                            title: data.title,
                                            type: type,
                                            posterUrl: data.posterUrl || '',
                                            releaseDate: data.releaseDate || '',
                                            source: source,
                                            slug: data.slug || '',
                                            genres: data.genres || [], // Evita o erro de 'never[]'
                                            status: initialData?.status || null
                                        } as MediaItem}
                                        themeColorBg={themeColorBg}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo dinâmico das abas abaixo */}
            <div className="max-w-7xl mx-auto px-8 md:px-12 mt-6">
                <ClientMediaTabs 
                    data={data}
                    cast={cast}
                    reviews={reviews}
                    trailerUrl={trailerUrl}
                    mediaId={params.id}
                    mediaType={type}
                    themeColorBg={themeColorBg}
                />
            </div>
        </main>
    );
}