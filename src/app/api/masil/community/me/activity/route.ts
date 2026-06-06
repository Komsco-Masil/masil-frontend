import { MASIL_API_BASE_URL, forwardAuthHeader, proxyJson } from "@/lib/masilApi";

export async function GET(request: Request) {
  try {
    const response = await fetch(`${MASIL_API_BASE_URL}/community/me/activity`, {
      headers: forwardAuthHeader(request),
      cache: "no-store",
    });
    return proxyJson(response);
  } catch {
    return Response.json({ detail: "내 활동 서버에 연결할 수 없습니다." }, { status: 503 });
  }
}
