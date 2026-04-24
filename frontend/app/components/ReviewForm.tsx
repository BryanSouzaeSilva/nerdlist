"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { saveReview } from "../actions/review";
import { toast } from "sonner";

interface ReviewFormProps {
    mediaId: string;
    type: string;
    initialData?: { rating: number; comment: string | null };
}

export default function ReviewForm({ mediaId, type, initialData }: ReviewFormProps) {
    const [rating, setRating] = useState(initialData?.rating || 0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState(initialData?.comment || "");
    const [loading, setLoading] = useState(false);

    async function handleSave() {
        if (rating === 0) return toast.error("Selecione uma nota!");
        setLoading(true);
        const res = await saveReview(mediaId, type, rating, comment);
        setLoading(false);
        if (res.success) toast.success("Avaliação salva!");
    }

    return (
        <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Sua Avaliação</h2>
            
            <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                    >
                        <Star
                            className={`w-8 h-8 transition-colors ${
                                star <= (hover || rating) ? "fill-emerald-500 text-emerald-500" : "text-gray-600"
                            }`}
                        />
                    </button>
                ))}
                <span className="text-gray-400 ml-2 font-bold">{rating}/5</span>
            </div>

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="O que você achou? (Opcional)"
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-4 text-white focus:border-emerald-500 focus:outline-none h-32 transition-colors"
            />

            <button
                onClick={handleSave}
                disabled={loading}
                className="mt-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black py-3 px-8 rounded-xl flex items-center gap-2 disabled:opacity-50 transition-all"
            >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Salvar Avaliação"}
            </button>
        </div>
    );
}