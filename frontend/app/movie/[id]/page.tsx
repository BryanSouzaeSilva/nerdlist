import { getMovieById } from "@/app/services/api";
import Image from "next/image";
import BackButton from "@/app/components/BackButton";

interface MoviePageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ type: string }>;
}

export default async function MoviePage(props: MoviePageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const id = params.id;
    const type = searchParams.type || 'MOVIE';

    const movie = await getMovieById(id, type);

    const isGame = movie.type === 'GAME';
    const isSeries = movie.type === 'SERIES';
    const isAnime = movie.type === 'ANIME';
    const isManga = movie.type === 'MANGA';

    const posterContainerClass = isGame
        ? "hidden md:block relative w-[400px] aspect-video rounded-xl overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.2)] border-2 border-red-500/30 hover:scale-105 transition-transform duration-500"
        : "hidden md:block relative w-64 aspect-2/3 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border-2 border-neutral-700/50 rotate-2 hover:rotate-0 transition-transform duration-500";

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
        <main className="min-h-screen bg-neutral-950 text-gray-100 pb-10">
            <div className="relative w-full h-[80vh] md:h-[70vh] overflow-hidden">
                
                <div className="absolute inset-0">
                    <Image
                        src={movie.backdropUrl || movie.posterUrl}
                        alt={movie.title}
                        fill
                        className="object-cover opacity-40 blur-sm md:blur-none"
                        priority
                    />
                    <div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-neutral-950 from-5% via-neutral-950/60 to-transparent translate-y-12" />
                </div>

                <div className="absolute bottom-0 left-0 w-full px-8 pb-12 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-8">
                    
                    <div className={posterContainerClass}>
                        <Image
                            src={movie.posterUrl}
                            alt={`Capa de ${movie.title}`}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="flex-1 space-y-4 z-10">
                        <BackButton colorClass={themeColorText} />

                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-lg">
                            {movie.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-200">
                            <span className="flex items-center gap-1 text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-2 py-1 rounded">
                                ★ {movie.rating?.toFixed(1)}
                            </span>
                            <span>•</span>
                            <span>{movie.releaseDate?.split("-")[0]}</span>
                            <span>•</span>
                            
                            <span>
                                {movie.extend?.value} {
                                    movie.extend?.unit === 'MINUTES' ? 'Minutos' :
                                    movie.extend?.unit === 'CHAPTERS' ? 'Capítulos' :
                                    'Episódios'
                                }
                            </span>
                            
                            <span>•</span>
                            <span className={`px-2 py-1 rounded border font-medium ${themeBadge}`}>
                                {
                                    movie.type === 'SERIES' ? 'Série' :
                                    movie.type === 'GAME' ? 'Jogo' :
                                    movie.type === 'ANIME' ? 'Anime' :
                                    movie.type === 'MANGA' ? 'Mangá' : 'Filme'
                                }
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            {movie.genres?.map((genre) => (
                                <span
                                    key={genre}
                                    className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 transition-colors"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 md:px-12 mt-12 grid md:grid-cols-[256px_1fr] gap-8">
                <div className="hidden md:block"></div>
                
                <div>
                    <h2 className={`text-2xl font-semibold mb-6 text-white flex items-center gap-3`}>
                        <span className={`w-1.5 h-6 rounded-full ${themeColorBg}`} />
                        Sinopse
                    </h2>
                    <p className="text-gray-400 leading-relaxed text-lg text-justify font-light">
                        {movie.synopsis || "Nenhuma sinopse disponível."}
                    </p>
                </div>
            </div>
        </main>
    );
}