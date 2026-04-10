"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

interface MediaDataInput {
  id: string | number;
  type: string;
  source?: string;
  title: string;
  posterUrl?: string;
  backdropUrl?: string;
}

export async function getUserList() {
  const session = await auth();
  if (!session?.user?.id) return { items: [], pins: [] };

  const items = await prisma.userItem.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' }
  });

  const pins = items.filter(item => item.isPinned);

  return { items, pins };
}

export async function saveMediaToList(mediaData: MediaDataInput, status: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Usuário não logado" };

  try {
    const item = await prisma.userItem.upsert({
      where: {
        userId_mediaId_type: {
          userId: session.user.id,
          mediaId: String(mediaData.id),
          type: mediaData.type,
        }
      },
      update: {
        status: status,
      },
      create: {
        userId: session.user.id,
        mediaId: String(mediaData.id),
        type: mediaData.type,
        source: mediaData.source || "TMDB",
        title: mediaData.title,
        posterUrl: mediaData.posterUrl || "",
        backdropUrl: mediaData.backdropUrl || "",
        status: status,
      }
    });

    revalidatePath(`/movie/${mediaData.id}`);
    revalidatePath("/perfil");
    
    return { success: true, item };
  } catch (error) {
    console.error("Erro ao salvar item:", error);
    return { error: "Erro ao salvar na lista" };
  }
}

export async function removeMediaFromList(mediaId: string, type: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Usuário não logado" };

  try {
    await prisma.userItem.delete({
      where: {
        userId_mediaId_type: {
          userId: session.user.id,
          mediaId: String(mediaId),
          type: type,
        }
      }
    });

    revalidatePath(`/movie/${mediaId}`);
    revalidatePath("/perfil");

    return { success: true };
  } catch (error) {
    console.error("Erro ao remover item:", error);
    return { error: "Erro ao remover da lista" };
  }
}

export async function togglePinMedia(mediaId: string, type: string, isPinned: boolean) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Usuário não logado" };

  try {
    if (isPinned) {
      await prisma.userItem.updateMany({
        where: { userId: session.user.id, type: type, isPinned: true },
        data: { isPinned: false }
      });
    }

    await prisma.userItem.updateMany({
      where: {
        userId: session.user.id,
        mediaId: String(mediaId),
        type: type,
      },
      data: { isPinned }
    });

    revalidatePath("/perfil");
    return { success: true };
  } catch (error) {
    console.error("Erro ao favoritar item:", error);
    return { error: "Erro ao favoritar" };
  }
}

export async function checkItemStatus(mediaId: string, type: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const item = await prisma.userItem.findUnique({
    where: {
      userId_mediaId_type: {
        userId: session.user.id,
        mediaId: String(mediaId),
        type: type,
      }
    }
  });

  return item ? { status: item.status, isPinned: item.isPinned } : null;
}