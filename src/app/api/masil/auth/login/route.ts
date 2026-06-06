const MASIL_API_BASE_URL =
  process.env.MASIL_API_BASE_URL ?? "http://localhost:8000/api";

type LoginPayload = {
  nickname?: string;
  password?: string;
};

export async function POST(request: Request) {
  let payload: LoginPayload;

  try {
    payload = (await request.json()) as LoginPayload;
  } catch {
    return Response.json({ detail: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const nickname = payload.nickname?.trim();
  const password = payload.password ?? "";

  if (!nickname || !password) {
    return Response.json({ detail: "닉네임과 비밀번호를 입력해주세요." }, { status: 400 });
  }

  const body = new URLSearchParams();
  body.set("username", nickname);
  body.set("password", password);

  try {
    const response = await fetch(`${MASIL_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
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
