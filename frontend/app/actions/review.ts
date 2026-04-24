"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function saveReview(mediaId: string, type: string, rating: number, comment?: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Você precisa estar logado para avaliar." };
    }

    try {
        await prisma.review.upsert({
            where: {
                userId_mediaId_type: {
                    userId: session.user.id,
                    mediaId: String(mediaId),
                    type
                }
            },
            update: {
                rating,
                comment
            },
            create: {
                userId: session.user.id,
                mediaId: String(mediaId),
                type,
                rating,
                comment
            }
        });

        revalidatePath(`/movie/${mediaId}`);
        return { success: true };
    } catch (error) {
        console.error("Erro ao salvar review:", error);
        return { error: "Falha ao processar a avaliação." };
    }
}

export async function getMediaReviews(mediaId: string, type: string) {
    return await prisma.review.findMany({
        where: { mediaId, type },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' }
    });
}