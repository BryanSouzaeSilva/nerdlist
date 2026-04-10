export default function LoadingMovie() {
    return (
        <main className="min-h-screen bg-neutral-950 text-gray-100 pb-20">
            <div className="relative w-full h-[85vh] md:h-[75vh] bg-neutral-900 animate-pulse">
                <div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-neutral-950 from-5% via-neutral-950/40 to-transparent translate-y-12" />
                
                <div className="absolute bottom-0 left-0 w-full z-10">
                    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-12 flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
                        
                        <div className="relative w-40 md:w-64 aspect-2/3 rounded-lg bg-neutral-800 shadow-2xl border-2 border-neutral-800/50" />

                        <div className="flex-1 space-y-4 w-full">
                            <div className="h-4 w-16 bg-neutral-800 rounded-full mb-6" />
                            <div className="h-12 md:h-16 w-3/4 md:w-1/2 bg-neutral-800 rounded-lg" />
                            <div className="h-6 w-48 bg-neutral-800 rounded-md" />
                            <div className="h-14 w-48 bg-neutral-800 rounded-2xl mt-4" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 md:px-12 mt-12 space-y-6">
                <div className="max-w-3xl space-y-3">
                    <div className="h-8 w-32 bg-neutral-800 rounded-md mb-6 animate-pulse" />
                    <div className="h-4 w-full bg-neutral-900 rounded-sm animate-pulse" />
                    <div className="h-4 w-full bg-neutral-900 rounded-sm animate-pulse" />
                    <div className="h-4 w-4/5 bg-neutral-900 rounded-sm animate-pulse" />
                    <div className="h-4 w-2/3 bg-neutral-900 rounded-sm animate-pulse" />
                </div>
            </div>
        </main>
    );
}