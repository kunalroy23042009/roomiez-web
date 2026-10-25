import { NextRequest } from "next/server";

// The same FastAPI service used by mobile owns authentication and database access.
async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const allowed = new Set(["rooms", "auth", "favorites", "leads", "reviews", "conversations", "assistant", "notifications", "devices"]);
  if (!allowed.has(path[0]) || path.some(part => part === "." || part === ".." || /[/\\]/.test(part))) {
    return Response.json({ detail: "Not found" }, { status: 404 });
  }
  const base = process.env.BACKEND_API_URL || "http://127.0.0.1:8000/api/v1";
  const upstream = new URL(`${base.replace(/\/$/, "")}/${path.map(encodeURIComponent).join("/")}`);
  if (upstream.origin === request.nextUrl.origin) {
    return Response.json({ detail: "Backend URL must point to FastAPI" }, { status: 503 });
  }
  upstream.search = request.nextUrl.search;
  const headers = new Headers();
  for (const name of ["authorization", "content-type", "accept"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  try {
    const response = await fetch(upstream, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(path[0] === "assistant" ? 90000 : 30000),
    });
    const outgoing = new Headers({ "Cache-Control": "no-store" });
    for (const name of ["content-type", "content-disposition", "retry-after"]) {
      const value = response.headers.get(name);
      if (value) outgoing.set(name, value);
    }
    return new Response(response.body, { status: response.status, headers: outgoing });
  } catch (error) {
    const timeout = error instanceof Error && error.name === "TimeoutError";
    return Response.json({ detail: timeout ? "Backend request timed out" : "Backend is unavailable" }, { status: timeout ? 504 : 502 });
  }
}

export { proxy as GET, proxy as POST, proxy as PATCH, proxy as PUT, proxy as DELETE, proxy as HEAD };
