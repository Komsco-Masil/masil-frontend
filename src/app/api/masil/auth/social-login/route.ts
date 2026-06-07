import { MASIL_API_BASE_URL } from "@/lib/masilApi";

type SocialLoginPayload = {
  provider?: string;
  social_id?: string;
  nickname?: string;
  neighborhood?: string;
};

export async function POST(request: Request) {
  let payload: SocialLoginPayload;

  try {
    payload = (await request.json()) as SocialLoginPayload;
  } catch {
    return Response.json({ detail: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  if (!payload.provider || !payload.social_id || !payload.nickname) {
    return Response.json({ detail: "소셜 로그인 정보가 부족합니다." }, { status: 400 });
  }

  try {
    const response = await fetch(`${MASIL_API_BASE_URL}/auth/social-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: payload.provider,
        social_id: payload.social_id,
        nickname: payload.nickname,
        neighborhood: payload.neighborhood ?? "동네 미설정",
      }),
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    return Response.json(data, { status: response.status });
  } catch {
    return Response.json(
      { detail: "Masil 백엔드에 연결할 수 없습니다. 서버가 켜져 있는지 확인해주세요." },
      { status: 503 },
    );
  }
}
