export default function SkeletonCard() {
    return (
        <div className="flex-none snap-start w-32 md:w-44 aspect-2/3 rounded-xl bg-neutral-800 animate-pulse border border-neutral-800 overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-t from-neutral-900/80 to-transparent" />
        </div>
    );
}