import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ClientProfileContent from "./ClientProfileContent";
import { getUserList } from "../actions/list";
import { prisma } from "@/lib/prisma";
import { MediaItem } from "../types/media-item";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const [{ items, pins }, reviews] = await Promise.all([
        getUserList(),
        prisma.review.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        })
    ]);

    const mappedItems = items.map(item => ({
        id: item.mediaId,
        type: item.type,
        source: item.source,
        title: item.title,
        posterUrl: item.posterUrl,
        backdropUrl: item.backdropUrl,
        userListStatus: item.status,
    } as unknown as MediaItem));

    const mappedPins = pins.map(item => ({
        id: item.mediaId,
        type: item.type,
        source: item.source,
        title: item.title,
        posterUrl: item.posterUrl,
        backdropUrl: item.backdropUrl,
    } as unknown as MediaItem));

    return (
        <ClientProfileContent
            userName={session.user.name?.split(" ")[0] || "Nerd"}
            items={mappedItems}
            pins={mappedPins}
            reviews={reviews}
        />
    );
}