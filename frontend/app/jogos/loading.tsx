import SkeletonCard from "@/app/components/SkeletonCard";

export default function LoadingGrid() {
    const skeletonArray = Array.from({ length: 12 });

    return (
        <main className="min-h-screen bg-neutral-950 pt-28 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="h-8 md:h-10 w-64 bg-neutral-800 rounded-md animate-pulse mb-8" />

                <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 lg:gap-8">
                    {skeletonArray.map((_, index) => (
                        <div key={index} className="flex justify-center">
                            <SkeletonCard />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}