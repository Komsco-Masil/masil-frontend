import { MASIL_API_BASE_URL } from "@/lib/masilApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nickname = searchParams.get("id")?.trim() ?? "";

  if (nickname.length < 2) {
    return Response.json(
      { available: false, detail: "아이디를 2자 이상 입력해주세요." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${MASIL_API_BASE_URL}/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );
    const data = await response.json().catch(() => ({}));

    return Response.json(data, { status: response.status });
  } catch {
    return Response.json(
      {
        available: false,
        detail: "Masil 백엔드에 연결할 수 없어 중복 확인을 완료하지 못했습니다.",
      },
      { status: 503 },
    );
  }
}
