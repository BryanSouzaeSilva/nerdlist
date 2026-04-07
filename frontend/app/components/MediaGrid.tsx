import Image from "next/image";
import Link from "next/link";
import { MediaItem } from "../types/media-item";
import SavedBadge from "./SaveBadge";

interface MediaGridProps {
    items: MediaItem[];
}

export default function MediaGrid({ items }: MediaGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        
        {items.map((item) => {
            const isGame = item.type === "GAME";
            const isSeries = item.type === "SERIES";
            const isAnime = item.type === "ANIME";
            const isManga = item.type === "MANGA";

            const aspectClass = isGame ? "aspect-video" : "aspect-2/3";
            
            const badgeBg = isSeries
            ? "bg-blue-500/20 text-blue-400 border-blue-500/20"
            : isGame
            ? "bg-red-500/20 text-red-400 border-red-500/20"
            : isAnime
            ? "bg-purple-500/20 text-purple-400 border-purple-500/20"
            : isManga
            ? "bg-orange-500/20 text-orange-400 border-orange-500/20"
            : "bg-emerald-500/20 text-emerald-400 border-emerald-500/20";
            
            const badgeText = isSeries ? "Série" : isGame ? "Jogo" : isAnime ? "Anime" : isManga ? "Mangá" : "Filme";

            return (
            <Link
                key={item.id}
                href={`/movie/${item?.id}?type=${item.type}&source=${item?.source || ''}`}
                className={`group relative self-start bg-neutral-900 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 border border-neutral-800 shadow-lg block ${badgeBg} hover:z-10`}
            >
                <div className={`relative ${aspectClass} w-full`}>
                    <Image
                        src={item.posterUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-neutral-950/90 via-neutral-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    <SavedBadge id={item.id} type={item.type} />
                </div>

                <div className="absolute bottom-0 p-3 w-full">
                    <h3 className="font-bold text-sm md:text-base text-white leading-tight truncate drop-shadow-md">
                        {item.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2 text-xs font-medium text-gray-300">
                        <span>{item.releaseDate?.split("-")[0] || ''}</span>
                        <span className={`px-2 py-0.5 rounded border ${badgeBg}`}>
                            {badgeText}
                        </span>
                    </div>
                </div>
            </Link>
            );
        })}
        
        </div>
    );
}