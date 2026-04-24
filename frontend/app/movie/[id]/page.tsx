import Image from "next/image";
import BackButton from "@/app/components/BackButton";
import TrailerPlayer from "@/app/components/TrailerPlayer";
import ListButton from "@/app/components/ListButton";
import ReviewForm from "@/app/components/ReviewForm";
import { auth } from "@/auth";
import { getMovieById } from "@/app/services/api";
import { checkItemStatus } from "@/app/actions/list";
import { getMediaReviews } from "@/app/actions/review";
import { Star } from "lucide-react";

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

interface CastMember {
    id: number;
    name: string;
    character: string;
    profileUrl: string | null;
}

interface MoviePageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ type: string, source?: string }>;
}

export default async function MoviePage(props: MoviePageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const session = await auth();

    const type = searchParams.type || 'MOVIE';
    const source = searchParams.source || '';

    const data = await getMovieById(params.id, type, source);
    const initialData = session?.user ? await checkItemStatus(params.id, type) : null;
    
    const reviews = await getMediaReviews(params.id, type) as ReviewWithUser[];
    const userReview = reviews.find((r) => r.userId === session?.user?.id);

    const isGame = data.type === 'GAME';
    const isSeries = data.type === 'SERIES';
    const isAnime = data.type === 'ANIME';
    const isManga = data.type === 'MANGA';

    const posterContainerClass = isGame
        ? "relative w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.3)] border-2 border-red-500/30 transition-transform duration-500"
        : "relative w-40 md:w-64 aspect-2/3 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border-2 border-neutral-700/50 transition-transform duration-500";

    const themeColorText = isGame ? "text-red-400" : isSeries ? "text-blue-400" : isAnime ? "text-purple-400" : isManga ? "text-orange-400" : "text-emerald-400";
    const themeColorBg = isGame ? "bg-red-500" : isSeries ? "bg-blue-500" : isAnime ? "bg-purple-500" : isManga ? "bg-orange-500" : "bg-emerald-500";
    
    const themeBadge = isGame
        ? "bg-red-500/10 border-red-500/20 text-red-400"
        : isSeries
        ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
        : isAnime
        ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
        : isManga
        ? "bg-orange-500/10 border-orange-500/20 text-orange-400"
        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";

    return (
        <main className="min-h-screen bg-neutral-950 text-gray-100 pb-20">
            <div className="relative w-full h-[85vh] md:h-[75vh] overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={data.backdropUrl || data.posterUrl}
                        alt={data.title}
                        fill
                        className="object-cover opacity-30 blur-none md:blur-sm"
                        priority
                    />
                    <div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-neutral-950 from-5% via-neutral-950/40 to-transparent translate-y-12" />
                </div>

                <div className="absolute bottom-0 left-0 w-full z-10">
                    <div className={`max-w-7xl mx-auto px-8 md:px-12 pb-12 flex flex-col ${isGame ? "items-start" : "md:flex-row md:items-end"} gap-6 md:gap-8`}>
                        
                        <div className={posterContainerClass}>
                            <Image
                                src={data.posterUrl}
                                alt={`Capa de ${data.title}`}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1 space-y-3 md:space-y-4">
                            <BackButton colorClass={themeColorText} />

                            <h1 className="text-3xl md:text-6xl font-black tracking-tight text-white drop-shadow-lg leading-tight">
                                {data.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-base text-gray-200">
                                <span className="flex items-center gap-1 text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
                                    ★ {data.rating?.toFixed(1)}
                                </span>
                                <span>•</span>
                                <span>{data.releaseDate?.split("-")[0]}</span>
                                <span>•</span>
                                
                                <span>
                                    {data.extend?.value} {
                                        data.extend?.unit === 'MINUTES' ? 'Min' :
                                        data.extend?.unit === 'CHAPTERS' ? 'Cap' :
                                        data.extend?.unit === 'HOURS' ? 'Horas' : 'Ep'
                                    }
                                </span>
                                
                                <span>•</span>
                                <span className={`px-2 py-0.5 rounded border font-medium ${themeBadge}`}>
                                    {
                                        data.type === 'SERIES' ? 'Série' :
                                        data.type === 'GAME' ? 'Jogo' :
                                        data.type === 'ANIME' ? 'Anime' :
                                        data.type === 'MANGA' ? 'Mangá' : 'Filme'
                                    }
                                </span>
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
                                <div className="flex flex-wrap items-center gap-6">
                                    <ListButton
                                        item={data}
                                        themeColorBg={themeColorBg}
                                        initialStatus={initialData?.status}
                                        initialPinned={initialData?.isPinned}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 md:px-12 mt-8 md:mt-12 space-y-12 md:space-y-16">
                <div className="max-w-3xl">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-white flex items-center gap-3">
                        <span className={`w-1.5 h-6 rounded-full ${themeColorBg}`} />
                        Sinopse
                    </h2>
                    <p className="text-gray-400 leading-relaxed text-base md:text-lg text-justify font-light">
                        {data.synopsis || "Nenhuma sinopse disponível."}
                    </p>
                </div>

                {data.trailerUrl && (
                    <div className="max-w-4xl">
                        <TrailerPlayer videoId={data.trailerUrl} />
                    </div>
                )}


                {data.cast && data.cast.length > 0 && (
                    <div className="pt-8 border-t border-white/5">
                        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white flex items-center gap-3">
                            <span className={`w-1.5 h-6 rounded-full ${themeColorBg}`} />
                            Elenco Principal
                        </h2>
                        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth custom-scrollbar">
                            {data.cast.map((actor: CastMember) => (
                                <div key={actor.id} className="flex-none w-28 md:w-40 text-center group snap-start">
                                    <div className="relative w-full aspect-3/4 rounded-xl overflow-hidden mb-3 border border-white/5 group-hover:border-white/20 transition-all duration-300 shadow-lg">
                                        {actor.profileUrl ? (
                                            <Image
                                                src={actor.profileUrl}
                                                alt={actor.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 112px, 160px"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-gray-500 text-[10px] italic">
                                                Sem Foto
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs md:text-sm font-bold text-white truncate px-1">{actor.name}</p>
                                    <p className="text-[10px] md:text-xs text-gray-500 truncate px-1 mt-0.5">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <section className="max-w-4xl">
                    {session?.user ? (
                        <ReviewForm
                            mediaId={params.id}
                            type={type}
                            initialData={userReview ? { rating: userReview.rating, comment: userReview.comment } : undefined} 
                        />
                    ) : (
                        <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl text-center">
                            <p className="text-gray-400 italic">
                                Faça <a href="/login" className="text-emerald-500 hover:underline">login</a> para deixar sua avaliação.
                            </p>
                        </div>
                    )}

                    <div className="mt-12 space-y-6">
                        <h3 className="text-2xl font-black text-white flex items-center gap-2">
                            <Star className="w-6 h-6 text-emerald-500 fill-emerald-500" />
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
                                                    <Image
                                                        src={rev.user.image}
                                                        alt={rev.user.name || 'Avatar'}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold uppercase">
                                                        {rev.user.name?.charAt(0)}
                                                    </div>
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
                </section>
            </div>
        </main>
    );
}