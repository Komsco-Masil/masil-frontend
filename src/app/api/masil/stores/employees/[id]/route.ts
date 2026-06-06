import { MASIL_API_BASE_URL, forwardAuthHeader, proxyJson } from "@/lib/masilApi";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const response = await fetch(`${MASIL_API_BASE_URL}/stores/employees/${id}`, {
      method: "DELETE",
      headers: forwardAuthHeader(request),
      cache: "no-store",
    });
    return proxyJson(response);
  } catch {
    return Response.json({ detail: "직원 해제 서버에 연결할 수 없습니다." }, { status: 503 });
  }
}
