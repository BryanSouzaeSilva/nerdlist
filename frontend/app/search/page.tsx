import { searchMedia } from "../services/api";
import MediaGrid from "../components/MediaGrid";
import { getUserList } from "../actions/list";
import { Search as SearchIcon } from "lucide-react";
import SearchInput from "../components/SearchInput";
import CategoryFilters from "../components/CategoryFilters";

interface SearchPageProps {
    searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const q = params.q || "";
    const type = params.type || "ALL";
    
    const [results, userListData] = q
        ? await Promise.all([
            searchMedia(q, type === 'ALL' ? undefined : type),
            getUserList()
        ])
        : [[], { items: [] }];

    const userList = userListData?.items || [];

    return (
        <main className="min-h-screen bg-neutral-950 px-6 pt-4 pb-24 md:pt-12 max-w-7xl mx-auto">
            
            <header className="mb-12 space-y-8">
                <div className="md:hidden space-y-6">
                    <h1 className="text-3xl font-black text-white tracking-tighter leading-none">
                        O que vamos <span className="text-emerald-500">explorar</span> hoje?
                    </h1>
                    <SearchInput initialValue={q} />
                </div>

                <div className="hidden md:block">
                    <h1 className="text-4xl font-black text-white mb-2">
                        Resultados para: <span className="text-emerald-500">&quot;{q}&quot;</span>
                    </h1>
                    <p className="text-neutral-500 font-medium">
                        Encontramos {results.length} itens correspondentes à sua busca em <span className="lowercase">{type === 'ALL' ? 'todas as categorias' : type}</span>.
                    </p>
                </div>

                <CategoryFilters />
            </header>

            <div className="space-y-8">
                {q ? (
                    results.length > 0 ? (
                        <MediaGrid items={results} userList={userList} />
                    ) : (
                        <div className="text-center py-32 bg-neutral-900/10 rounded-3xl border border-dashed border-white/5">
                            <p className="text-neutral-500 font-medium italic">Nenhum resultado encontrado para essa busca.</p>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 opacity-10 text-center space-y-6">
                        <SearchIcon size={100} strokeWidth={0.5} className="text-white" />
                        <p className="font-black uppercase tracking-[0.5em] text-xs">Aguardando sua curiosidade</p>
                    </div>
                )}
            </div>
        </main>
    );
}