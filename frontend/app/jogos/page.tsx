// import { getGames } from "./services/api";
// import Link from "next/link";
// import Image  from "next/image";

// export default async function JogosPage() {
//     const movies = await getGames();

//     return (
//         <div className="min-h-screen p-8 md:p-12">
//             <header className="mb-12">
//                 <h1 className="text-4xl font-bold text-white mb-2">Jogos Populares</h1>
//                 <p className="text-gray-400">Explore os títulos mais populares dos jogos</p>
//             </header>

//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols6 gap-6">
//                 {movies.map((movie) => (
//                     <Link
//                         key={movie.id}
//                         href={`/movie/${movie.id}?type=MOVIE`}
//                         className="group block bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-emerald-500/50 transition-all"
//                     >
//                         <div className="relative aspect-[2/3">
//                             <Image
//                                 src={movie.posterUrl}
//                                 alt={movie.title}
//                                 fill
//                                 className="object-cover group-hover:scale-105 transition-transform duration300"
//                             />
//                         </div>
//                         <div className="p-3">
//                             <h3 className="font-medium text-sm text-white truncate">{movie.title}</h3>
//                             <p className="text-xs text-gray-500">{movie.releaseDate.split('-')[0]}</p>
//                         </div>
//                     </Link>
//                 ))}
//             </div>
//         </div>
//     )
// }