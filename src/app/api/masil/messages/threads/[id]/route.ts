import { MASIL_API_BASE_URL, forwardAuthHeader, proxyJson } from "@/lib/masilApi";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const response = await fetch(`${MASIL_API_BASE_URL}/messages/threads/${id}`, {
      headers: forwardAuthHeader(request),
      cache: "no-store",
    });
    return proxyJson(response);
  } catch {
    return Response.json({ detail: "채팅 서버에 연결할 수 없습니다." }, { status: 503 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ detail: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  try {
    const response = await fetch(`${MASIL_API_BASE_URL}/messages/threads/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...forwardAuthHeader(request),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    return proxyJson(response);
  } catch {
    return Response.json({ detail: "채팅 서버에 연결할 수 없습니다." }, { status: 503 });
  }
}
