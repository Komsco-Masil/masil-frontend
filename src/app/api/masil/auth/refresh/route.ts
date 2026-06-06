import { MASIL_API_BASE_URL, proxyJson } from "@/lib/masilApi";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ detail: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  try {
    const response = await fetch(`${MASIL_API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    return proxyJson(response);
  } catch {
    return Response.json({ detail: "토큰 갱신 서버에 연결할 수 없습니다." }, { status: 503 });
  }
}
