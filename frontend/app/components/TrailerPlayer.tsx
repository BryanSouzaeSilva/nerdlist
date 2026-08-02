interface TrailerPlayerProps {
    videoId: string;
}

export default function TrailerPlayer({ videoId }: TrailerPlayerProps) {
    if (!videoId) return null;

    return (
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                title="Trailer Oficial"
                className="w-full h-full absolute top-0 left-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}