import CommunityPostDetailPage from "@/components/community/CommunityPostDetailPage";

export default async function CommunityPostDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CommunityPostDetailPage postId={id} />;
}
