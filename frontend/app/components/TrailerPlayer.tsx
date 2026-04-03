interface TrailerPlayerProps {
    videoId: string;
}

export default function TrailerPlayer({ videoId }: TrailerPlayerProps) {
    if (!videoId) return null;

    const isDirectVideo = videoId.includes('http');

    return (
        <div className="w-full">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
                <span className="w-1.5 h-6 rounded-full bg-red-600" />
                Trailer Oficial
            </h2>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                {isDirectVideo ? (
                    <video
                        src={videoId}
                        controls
                        className="w-full h-full"
                        poster="/window.svg"
                    />
                ) : (
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                        title="YouTube trailer"
                        allowFullScreen
                    />
                )}
            </div>
        </div>
    );
}