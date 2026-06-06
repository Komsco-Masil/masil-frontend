import { MASIL_API_BASE_URL, forwardAuthHeader, proxyJson } from "@/lib/masilApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("store_id");
  const query = storeId ? `?store_id=${encodeURIComponent(storeId)}` : "";

  try {
    const response = await fetch(`${MASIL_API_BASE_URL}/promotions/${query}`, {
      cache: "no-store",
    });
    return proxyJson(response);
  } catch {
    return Response.json({ detail: "홍보글 서버에 연결할 수 없습니다." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ detail: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  try {
    const response = await fetch(`${MASIL_API_BASE_URL}/promotions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...forwardAuthHeader(request),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    return proxyJson(response);
  } catch {
    return Response.json({ detail: "홍보글 서버에 연결할 수 없습니다." }, { status: 503 });
  }
}
