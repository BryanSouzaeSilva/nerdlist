interface TrailerPlayerProps {
    videoId: string;
}

export default function TrailerPlayer({ videoId }: TrailerPlayerProps) {
    if (!videoId) return null;

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span className="w-1.5 h-6 rounded-full bg-red-600" />
                Trailer Oficial
            </h2>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                <iframe
                    className="absolute insert-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="Youtube Trailer"
                    allowFullScreen
                />
            </div>
        </div>
    );
}