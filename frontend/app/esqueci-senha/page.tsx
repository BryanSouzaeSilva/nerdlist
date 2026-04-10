"use client";

import { useState } from "react";
import Link from "next/link";
import { Key, Loader2, Mail } from "lucide-react";
import { generateResetToken } from "../actions/reset";

export default function ForgotPasswordPage() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");
        setMessage("");

        const res = await generateResetToken(formData);

        if (res?.error) {
        setError(res.error);
        } else {
        setMessage("Se o e-mail existir em nosso sistema, você receberá um link de recuperação (Olhe o terminal do VS Code!).");
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
        <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl shadow-emerald-900/20">
            
            <div className="flex flex-col items-center mb-8">
            <div className="bg-emerald-500 p-3 rounded-xl mb-4 shadow-lg shadow-emerald-500/20">
                <Key className="w-6 h-6 text-neutral-950" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter text-center">
                Esqueceu a senha?
            </h1>
            <p className="text-gray-400 text-sm mt-2 text-center">
                Digite seu e-mail para recuperar o acesso ao seu cofre.
            </p>
            </div>

            {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
                {error}
            </div>
            )}

            {message ? (
            <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 text-sm p-4 rounded-lg mb-6 text-center font-medium">
                {message}
            </div>
            ) : (
            <form action={handleSubmit} className="space-y-4">
                <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">E-mail</label>
                <div className="relative mt-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input name="email" type="email" required placeholder="seu@email.com" className="w-full bg-neutral-950 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors" />
                </div>
                </div>

                <button disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black py-3.5 rounded-lg transition-all uppercase tracking-widest mt-6 flex items-center justify-center disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Recuperar Senha"}
                </button>
            </form>
            )}

            <p className="text-center text-sm text-gray-400 mt-8">
            Lembrou a senha? <Link href="/login" className="text-emerald-500 font-bold hover:underline">Voltar para o Login</Link>
            </p>
        </div>
        </div>
    );
}