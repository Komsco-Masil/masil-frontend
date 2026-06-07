import { MASIL_API_BASE_URL, proxyJson } from "@/lib/masilApi";

export async function GET() {
  try {
    const response = await fetch(`${MASIL_API_BASE_URL}/stores/public-data/summary`, {
      cache: "no-store",
    });

    return proxyJson(response);
  } catch {
    return Response.json({ detail: "공공데이터 요약 정보를 불러올 수 없습니다." }, { status: 503 });
  }
}
