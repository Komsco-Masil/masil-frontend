import MessageDetailPage from "@/components/messages/MessageDetailPage";

export default async function MessageDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <MessageDetailPage threadId={id} />;
}
