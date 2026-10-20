import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-schema";

export const runtime = "nodejs";

const WINDOW_MS = 60_000;
const REQUESTS_PER_WINDOW = 10;
const requestWindows = new Map<string, { startedAt: number; count: number }>();

function isRateLimited(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const address = /^[0-9a-fA-F:.]{1,64}$/.test(forwarded) ? forwarded : "unknown";
  const key = createHash("sha256").update(`${address}:${process.env.LEADS_RATE_LIMIT_SALT ?? "preview"}`).digest("hex");
  const now = Date.now();
  const existing = requestWindows.get(key);
  if (!existing || now - existing.startedAt >= WINDOW_MS) {
    requestWindows.set(key, { startedAt: now, count: 1 });
  } else {
    existing.count += 1;
    if (existing.count > REQUESTS_PER_WINDOW) return true;
  }
  if (requestWindows.size > 2000) {
    for (const [savedKey, window] of requestWindows) if (now - window.startedAt >= WINDOW_MS) requestWindows.delete(savedKey);
  }
  return false;
}

type JsonReadResult = { kind: "ok"; value: unknown } | { kind: "invalid" } | { kind: "too_large" };

async function readLimitedJson(request: Request): Promise<JsonReadResult> {
  const reader = request.body?.getReader();
  if (!reader) return { kind: "invalid" };
  const decoder = new TextDecoder();
  let body = "";
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 32_000) {
        await reader.cancel();
        return { kind: "too_large" };
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    return { kind: "ok", value: JSON.parse(body) as unknown };
  } catch {
    return { kind: "invalid" };
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const requestUrl = new URL(request.url);
      const host = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() || request.headers.get("host") || requestUrl.host;
      const protocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || requestUrl.protocol.slice(0, -1);
      if (new URL(origin).origin !== `${protocol}://${host}`) {
        return NextResponse.json({ ok: false, message: "Источник запроса не прошёл проверку." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ ok: false, message: "Источник запроса не прошёл проверку." }, { status: 403 });
    }
  }

  if (isRateLimited(request)) {
    return NextResponse.json({ ok: false, message: "Слишком много попыток. Подождите немного и повторите." }, { status: 429, headers: { "Retry-After": "60" } });
  }

  const body = await readLimitedJson(request);
  if (body.kind === "too_large") {
    return NextResponse.json({ ok: false, message: "Запрос слишком большой." }, { status: 413 });
  }
  if (body.kind === "invalid") {
    return NextResponse.json({ ok: false, message: "Проверьте заполненные поля." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body.value);
  if (!parsed.success) {
    const fields = Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0] ?? "form"), issue.message]));
    return NextResponse.json({ ok: false, message: "Проверьте заполненные поля.", fields }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: false, message: "Не удалось проверить запрос." }, { status: 400 });
  }

  // Delivery is intentionally disabled until the owner approves a real transport and privacy documents.
  return NextResponse.json({
    ok: false,
    code: "DEMO_DISABLED",
    message: "Демо: запрос не отправлен. Канал заявок и документы пока не подключены."
  }, { status: 503 });
}
