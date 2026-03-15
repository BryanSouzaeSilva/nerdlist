"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
    colorClass: string;
}

export default function BackButton({ colorClass }: BackButtonProps) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className={`inline-flex items-center text-sm ${colorClass} hover:opacity-80 transition-opacity mb-2 cursor-pointer`}
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
        </button>
    );
}