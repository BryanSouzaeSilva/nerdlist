"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Clapperboard, Loader2 } from "lucide-react";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");
    const reset = searchParams.get("reset");
    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("E-mail ou senha incorretos.");
            setLoading(false);
        } else {
            router.push("/");
            router.refresh();
        }
    }

    return (
        <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl shadow-emerald-900/20">
            
            <div className="flex flex-col items-center mb-8">
                <div className="bg-emerald-500 p-3 rounded-xl mb-4 shadow-lg shadow-emerald-500/20">
                    <Clapperboard className="w-6 h-6 text-neutral-950" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tighter">
                    Entrar no Nerd<span className="text-emerald-500">List</span>
                </h1>
                <p className="text-gray-400 text-sm mt-2">Bem-vindo de volta ao seu cofre.</p>
            </div>

            {registered && (
                <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 text-sm p-3 rounded-lg mb-6 text-center font-medium">
                    Conta criada com sucesso! Faça login.
                </div>
            )}

            {reset && (
                <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 text-sm p-3 rounded-lg mb-6 text-center font-medium">
                    Senha alterada com sucesso! Faça login.
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">E-mail</label>
                    <input name="email" type="email" required placeholder="seu@email.com" className="w-full mt-1 bg-neutral-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors" />
                </div>

                <div>
                    <div className="flex justify-between items-center mt-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Senha</label>
                            <Link href="/esqueci-senha" className="text-xs text-emerald-500 hover:underline">Esqueceu a senha?</Link>
                        </div>
                    <input name="password" type="password" required placeholder="••••••••" className="w-full mt-1 bg-neutral-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors" />
                </div>

                <button disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black py-3.5 rounded-lg transition-all uppercase tracking-widest mt-6 flex items-center justify-center disabled:opacity-50">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Acessar Cofre"}
                </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-8">
                Ainda não tem conta? <Link href="/cadastro" className="text-emerald-500 font-bold hover:underline">Cadastre-se</Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
            <Suspense fallback={
                <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                </div>
            }>
                <LoginContent />
            </Suspense>
        </div>
    );
}