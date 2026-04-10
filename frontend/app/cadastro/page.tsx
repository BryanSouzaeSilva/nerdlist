"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clapperboard, Loader2 } from "lucide-react";
import { registerUser } from "../actions/auth";

export default function CadastroPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");
        
        const res = await registerUser(formData);
        
        if (res?.error) {
        setError(res.error);
        setLoading(false);
        } else {
        router.push("/login?registered=true");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
            <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl shadow-emerald-900/20">
                
                <div className="flex flex-col items-center mb-8">
                <div className="bg-emerald-500 p-3 rounded-xl mb-4 shadow-lg shadow-emerald-500/20">
                    <Clapperboard className="w-6 h-6 text-neutral-950" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tighter">
                    Criar conta no Nerd<span className="text-emerald-500">List</span>
                </h1>
                <p className="text-gray-400 text-sm mt-2">Crie seu cofre de cultura pop.</p>
                </div>

                {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
                    {error}
                </div>
                )}

                <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nome de Exibição</label>
                    <input name="name" type="text" required placeholder="Seu nome" className="w-full mt-1 bg-neutral-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors" />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nome de Usuário (@)</label>
                    <input name="username" type="text" required placeholder="ex: bryansouza" className="w-full mt-1 bg-neutral-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors" />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">E-mail</label>
                    <input name="email" type="email" required placeholder="seu@email.com" className="w-full mt-1 bg-neutral-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors" />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Senha</label>
                    <input name="password" type="password" required placeholder="••••••••" className="w-full mt-1 bg-neutral-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors" />
                </div>

                <button disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black py-3.5 rounded-lg transition-all uppercase tracking-widest mt-4 flex items-center justify-center disabled:opacity-50">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Criar Cofre"}
                </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-8">
                    Já tem uma conta? <Link href="/login" className="text-emerald-500 font-bold hover:underline">Entrar</Link>
                </p>
            </div>
        </div>
    );
}