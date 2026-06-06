import { MASIL_API_BASE_URL, forwardAuthHeader, proxyJson } from "@/lib/masilApi";

export async function POST(request: Request) {
  try {
    const response = await fetch(`${MASIL_API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: forwardAuthHeader(request),
      cache: "no-store",
    });
    return proxyJson(response);
  } catch {
    return Response.json({ detail: "로그아웃 서버에 연결할 수 없습니다." }, { status: 503 });
  }
}
