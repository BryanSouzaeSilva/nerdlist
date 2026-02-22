import { getMovieById } from "@/app/services/api";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface MoviePageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{
        type: string;
    }>;
}

export default async function MoviePage(props: MoviePageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const id = params.id;
    const type = searchParams.type || 'MOVIE';

    const movie = await getMovieById(id, type);

    return (
        <main className="min-h-screen bg-neutral-950 text-gray-100 pb-10">
            <div className="relative w-full h-[80vh] md:h-[70vh] overflow-hidden">
                
                    <div className="absolute inset-0">
                        <Image
                            src={movie.backdropUrl || movie.posterUrl}
                            alt={movie.title}
                            fill
                            className="object-cover opacity-40 blur-none"
                            priority
                        />
                    <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-neutral-950 from-5% via-neutral-950/60 to-transparent translate-y-12" />
                </div>

            <div className="absolute bottom-0 left-0 w-full px-8 pb-12 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-8">
                
                <div className="hidden md:block relative w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border-2 border-neutral-700/50 rotate-2 hover:rotate-0 transition-transform duration-500">
                    <Image
                        src={movie.posterUrl}
                        alt={`Capa de ${movie.title}`}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex-1 space-y-4">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 transition-colors mb-2"
                    >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para lista
                    </Link>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
                        {movie.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-200">
                        <span className="flex items-center gap-1 text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-2 py-1 rounded">
                            ★ {movie.rating?.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{movie.releaseDate?.split("-")[0]}</span>
                        <span>•</span>
                        <span className="bg-neutral-800/80 px-2 py-1 rounded text-gray-300 border border-neutral-700">
                            {movie.type}
                        </span>
                    </div>
                </div>
            </div>
        </div>

            <div className="max-w-7xl mx-auto px-8 md:px-12 mt-12 grid md:grid-cols-[256px_1fr] gap-8">
                <div className="hidden md:block"></div>
                
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-emerald-500 flex items-center gap-2">
                        Sinopse
                    </h2>
                    <p className="text-gray-400 leading-relaxed text-lg text-justify">
                        {movie.synopsis || "Nenhuma sinopse disponível."}
                    </p>
                </div>
            </div>
        </main>
    );
}