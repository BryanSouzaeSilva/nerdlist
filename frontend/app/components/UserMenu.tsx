import { auth, signIn, signOut } from "@/auth";
import Image from "next/image";
import { LogOut, User as UserIcon } from "lucide-react";

export default async function UserMenu() {
    const session = await auth();

    if (session?.user) {
        return (
        <div className="flex items-center gap-4 group relative">
            <div className="flex flex-col items-end hidden md:flex">
            <span className="text-sm font-bold text-white leading-none">
                {session.user.name}
            </span>
            <span className="text-[10px] text-gray-400">Membro NerdList</span>
            </div>

            <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-orange-600 overflow-hidden cursor-pointer hover:scale-105 transition-transform">
                {session.user.image ? (
                <Image
                    src={session.user.image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover"
                />
                ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                    <UserIcon className="text-gray-400 w-6 h-6" />
                </div>
                )}
            </div>

            <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-white/10 rounded-md shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="px-4 py-2 border-b border-white/5 mb-2 md:hidden">
                    <p className="text-sm font-bold text-white truncate">{session.user.name}</p>
                </div>
                
                <form
                    action={async () => {
                        "use server";
                        await signOut();
                    }}
                >
                <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-white/5 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sair da Conta
                </button>
                </form>
            </div>
            </div>
        </div>
        );
    }

    return (
        <form
        action={async () => {
            "use server";
            await signIn("google");
        }}
        >
        <button
            type="submit"
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-black py-2 px-6 rounded-sm transition-all uppercase text-xs tracking-widest shadow-lg shadow-orange-900/20 active:scale-95"
        >
            <UserIcon className="w-4 h-4" />
            Entrar
        </button>
        </form>
    );
}