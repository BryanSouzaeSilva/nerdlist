"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Key, Loader2 } from "lucide-react";
import { resetPassword } from "../actions/reset";

export default function NewPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        if (!token) {
        setError("Token de recuperação ausente.");
        return;
        }

        setLoading(true);
        setError("");

        const res = await resetPassword(token, formData);

        if (res?.error) {
        setError(res.error);
        setLoading(false);
        } else {
        router.push("/login?reset=true");
        }
    }

    if (!token) {
        return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 px-4 text-center">
            <h1 className="text-2xl font-black text-white tracking-tighter mb-2">Link Inválido</h1>
            <p className="text-gray-400 mb-6">O link de recuperação está incompleto ou inválido.</p>
            <Link href="/esqueci-senha" className="text-emerald-500 font-bold hover:underline">Solicitar novo link</Link>
        </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
        <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl shadow-emerald-900/20">
            
            <div className="flex flex-col items-center mb-8">
            <div className="bg-emerald-500 p-3 rounded-xl mb-4 shadow-lg shadow-emerald-500/20">
                <Key className="w-6 h-6 text-neutral-950" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter text-center">
                Criar Nova Senha
            </h1>
            <p className="text-gray-400 text-sm mt-2 text-center">
                Digite sua nova senha abaixo.
            </p>
            </div>

            {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
                {error}
            </div>
            )}

            <form action={handleSubmit} className="space-y-4">
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nova Senha</label>
                <input name="password" type="password" required placeholder="••••••••" minLength={6} className="w-full mt-1 bg-neutral-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors" />
            </div>

            <button disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black py-3.5 rounded-lg transition-all uppercase tracking-widest mt-6 flex items-center justify-center disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Salvar e Entrar"}
            </button>
            </form>
        </div>
        </div>
    );
}