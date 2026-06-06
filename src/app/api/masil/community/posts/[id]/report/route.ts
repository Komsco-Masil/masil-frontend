import { MASIL_API_BASE_URL, proxyJson } from "@/lib/masilApi";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const response = await fetch(`${MASIL_API_BASE_URL}/community/posts/${id}/report`, {
      method: "POST",
      cache: "no-store",
    });
    return proxyJson(response);
  } catch {
    return Response.json({ detail: "신고 서버에 연결할 수 없습니다." }, { status: 503 });
  }
}
