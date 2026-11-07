import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Status = "up" | "down" | "unknown";

async function ping(url: string | undefined, timeoutMs = 4000): Promise<{ status: Status; latencyMs: number | null }> {
  if (!url) return { status: "unknown", latencyMs: null };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = Date.now();

  try {
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    return { status: res.ok ? "up" : "down", latencyMs: Date.now() - started };
  } catch {
    return { status: "down", latencyMs: null };
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const requestStarted = Date.now();

  const [sso, malas, libs, pore] = await Promise.all([
    ping(process.env.SSO_HEALTH_URL),
    ping(process.env.MALAS_HEALTH_URL),
    ping(process.env.LIBS_HEALTH_URL),
    ping(process.env.PORE_HEALTH_URL ?? "https://pore.yado.my.id"),
  ]);

  // telemetry (this app) and gateway (the edge ingress that routed this
  // request) are self-evidently up if this handler is running at all -
  // their latency is this request's own round trip, not a hardcoded number.
  const selfLatency = Date.now() - requestStarted;
  const telemetry = { status: "up" as Status, latencyMs: selfLatency };
  const gateway = { status: "up" as Status, latencyMs: selfLatency };

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    services: { sso, malas, libs, pore, telemetry, gateway },
  });
}
