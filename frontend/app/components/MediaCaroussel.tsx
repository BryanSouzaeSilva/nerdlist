"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaItem } from "../types/media-item";
import SavedBadge from "./SaveBadge";

interface UserListItem {
    mediaId: string;
    type: string;
    status: string;
}

interface MediaCarouselProps {
    title: string;
    items: MediaItem[];
    colorClass: string;
    userList?: UserListItem[];
}

export default function MediaCarousel({ title, items = [], colorClass, userList = [] }: MediaCarouselProps) {
    const carouselRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (carouselRef.current) {
            const scrollAmount = window.innerWidth * 0.7;
            carouselRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="relative group">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span className={`w-1.5 h-6 rounded-full ${colorClass}`} />
                {title}
            </h2>

            <button onClick={() => scroll("left")} className="absolute left-2 top-[50%] -translate-y-1/2 z-20 bg-neutral-900/90 hover:bg-neutral-800 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10 hidden md:block hover:scale-110">
                <ChevronLeft className="w-6 h-6" />
            </button>

            <div ref={carouselRef} className="flex gap-6 overflow-x-auto overflow-y-hidden pb-8 pt-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
                {items?.map((item) => {
                    const isGame = item.type === "GAME";
                    const isSeries = item.type === "SERIES";
                    const isAnime = item.type === "ANIME";
                    const isManga = item.type === "MANGA";

                    const aspectClass = isGame ? "aspect-video" : "aspect-2/3";
                    const cardWidthClass = isGame ? "w-64 md:w-80" : "w-45 md:w-55";

                    const badgeBg = isSeries ? "bg-blue-500/20 text-blue-400 border-blue-500/20" : isGame ? "bg-red-500/20 text-red-400 border-red-500/20" : isAnime ? "bg-purple-500/20 text-purple-400 border-purple-500/20" : isManga ? "bg-orange-500/20 text-orange-400 border-orange-500/20" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/20";
                    const badgeText = isSeries ? "Série" : isGame ? "Jogo" : isAnime ? "Anime" : isManga ? "Mangá" : "Filme";

                    const savedInfo = userList.find(s => String(s.mediaId) === String(item.id) && s.type === item.type);

                    return (
                        <Link key={item.id} href={`/movie/${item?.id}?type=${item.type}&source=${item?.source || ''}`} className={`group/card relative flex-none ${cardWidthClass} snap-start bg-neutral-900 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 border border-neutral-800 shadow-lg block hover:z-10`}>
                            <div className={`relative ${aspectClass} w-full`}>
                                <Image src={item.posterUrl} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 180px, 220px" />
                                <div className="absolute inset-0 bg-linear-to-t from-neutral-950/90 via-neutral-950/20 to-transparent opacity-80 group-hover/card:opacity-100 transition-opacity" />
                                
                                <SavedBadge id={item.id} type={item.type} initialStatus={savedInfo?.status} />
                            </div>

                            <div className="absolute bottom-0 p-4 w-full">
                                <h3 className="font-bold text-base text-white leading-tight truncate drop-shadow-md">{item.title}</h3>
                                <div className="flex items-center justify-between mt-2 text-xs font-medium text-gray-300">
                                    <span>{item.releaseDate?.split("-")[0] || ''}</span>
                                    <span className={`px-2 py-0.5 rounded border ${badgeBg}`}>{badgeText}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <button onClick={() => scroll("right")} className="absolute right-2 top-[50%] -translate-y-1/2 z-20 bg-neutral-900/90 hover:bg-neutral-800 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10 hidden md:block hover:scale-110">
                <ChevronRight className="w-6 h-6" />
            </button>
        </section>
    );
}