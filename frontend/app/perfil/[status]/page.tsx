import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserList } from "../../actions/list";
import { MediaItem } from "../../types/media-item";
import ClientStatusContent from "./ClientStatusContent";

interface StatusPageProps {
    params: Promise<{ status: string }>;
}

export default async function StatusPage(props: StatusPageProps) {
    const params = await props.params;
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const { items } = await getUserList();

    const mappedItems = items.map(item => ({
        id: item.mediaId,
        type: item.type,
        source: item.source,
        title: item.title,
        posterUrl: item.posterUrl,
        backdropUrl: item.backdropUrl,
        userListStatus: item.status,
    } as unknown as MediaItem));

    return <ClientStatusContent items={mappedItems} urlStatus={params.status} />;
}