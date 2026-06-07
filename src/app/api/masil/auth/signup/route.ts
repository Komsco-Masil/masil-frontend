import { MASIL_API_BASE_URL } from "@/lib/masilApi";

type SignupPayload = {
  nickname?: string;
  neighborhood?: string;
  password?: string;
  is_terms_agreed?: boolean;
};

export async function POST(request: Request) {
  let payload: SignupPayload;

  try {
    payload = (await request.json()) as SignupPayload;
  } catch {
    return Response.json({ detail: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const nickname = payload.nickname?.trim();
  const neighborhood = payload.neighborhood?.trim();
  const password = payload.password ?? "";

  if (!nickname || !neighborhood || !password) {
    return Response.json(
      { detail: "동네, 닉네임, 비밀번호를 모두 입력해주세요." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${MASIL_API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname,
        neighborhood,
        password,
        is_terms_agreed: payload.is_terms_agreed === true,
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
