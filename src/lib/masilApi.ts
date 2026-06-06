export const MASIL_API_BASE_URL = process.env.MASIL_API_BASE_URL ?? "http://localhost:8000/api";

export function forwardAuthHeader(request: Request): Record<string, string> {
  const authorization = request.headers.get("authorization");
  return authorization ? { Authorization: authorization } : {};
}

export async function proxyJson(response: globalThis.Response) {
  const data = await response.json().catch(() => ({}));
  return Response.json(data, { status: response.status });
}
