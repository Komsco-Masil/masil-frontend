import { MASIL_API_BASE_URL, forwardAuthHeader, proxyJson } from "@/lib/masilApi";

type ProfilePayload = {
  nickname?: string;
  neighborhood?: string;
  avatarUrl?: string;
};

export async function GET(request: Request) {
  try {
    const response = await fetch(`${MASIL_API_BASE_URL}/auth/me`, {
      headers: forwardAuthHeader(request),
      cache: "no-store",
    });

    return proxyJson(response);
  } catch {
    return Response.json(
      { detail: "Masil 백엔드에 연결할 수 없습니다. 서버가 켜져 있는지 확인해주세요." },
      { status: 503 },
    );
  }
}

export async function PATCH(request: Request) {
  let payload: ProfilePayload;

  try {
    payload = (await request.json()) as ProfilePayload;
  } catch {
    return Response.json({ detail: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  try {
    const response = await fetch(`${MASIL_API_BASE_URL}/auth/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...forwardAuthHeader(request),
      },
      body: JSON.stringify({
        nickname: payload.nickname?.trim(),
        neighborhood: payload.neighborhood?.trim(),
        avatar_url: payload.avatarUrl,
      }),
      cache: "no-store",
    });

    return proxyJson(response);
  } catch {
    return Response.json(
      { detail: "Masil 백엔드에 연결할 수 없습니다. 서버가 켜져 있는지 확인해주세요." },
      { status: 503 },
    );
  }
}
