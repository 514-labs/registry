import type { Hook } from "../types/hooks";
import type { HttpResponseEnvelope } from "../types/envelopes";
import type { LogLevel, LoggingOptions } from "../types/config";

function levelToNum(level: LogLevel): number {
  switch (level) {
    case "debug":
      return 10;
    case "info":
      return 20;
    case "warn":
      return 30;
    case "error":
      return 40;
    default:
      return 20;
  }
}

function isEnabled(min: LogLevel, lvl: LogLevel): boolean {
  return levelToNum(lvl) >= levelToNum(min);
}

function writeConsole(level: LogLevel, event: Record<string, unknown>) {
  const line = JSON.stringify(event);
  if (level === "debug") {
    console.debug(line);
  } else if (level === "info") {
    console.info(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.error(line);
  }
}

function safeJson(input: unknown): unknown {
  try {
    return JSON.parse(JSON.stringify(input));
  } catch {
    return undefined;
  }
}

function computeItemCount(data: unknown): number | undefined {
  if (Array.isArray(data)) return data.length;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const items = obj.items ?? obj.results;
    if (Array.isArray(items)) return items.length;
  }
  return undefined;
}

export function createLoggingHooks(options: LoggingOptions = {}): Partial<Record<"beforeRequest" | "afterResponse" | "onError" | "onRetry", Hook[]>> {
  const {
    level = "info",
    includeQueryParams = false,
    includeHeaders = false,
    includeBody = false,
    logger = writeConsole,
  } = options;

  const beforeRequest: Hook = {
    name: "log-before-request",
    priority: 1000,
    execute: (ctx) => {
      if (ctx.type !== "beforeRequest" || !ctx.request) return;
      if (!isEnabled(level, "info")) return;
      try {
        const req = ctx.request as { method?: unknown; url?: unknown; headers?: unknown; body?: unknown };
        const urlStr = String(req.url ?? "");
        const u = urlStr ? new URL(urlStr) : undefined;
        const event: Record<string, unknown> = {
          ts: new Date().toISOString(),
          event: "http_request",
          phase: "beforeRequest",
          operation: ctx.operation,
          method: req.method,
          url: includeQueryParams ? urlStr : (u ? `${u.origin}${u.pathname}` : urlStr),
          host: u?.hostname,
          path: u?.pathname,
        };
        if (includeQueryParams && u) {
          const query: Record<string, string> = {};
          u.searchParams.forEach((v, k) => (query[k] = v));
          event.query = query;
        }
        if (includeHeaders) event.headers = safeJson(req.headers);
        if (includeBody) event.body = safeJson((req as any).body);
        logger("info", event);
      } catch (e) {
        // Best-effort logging; never throw
      }
    },
  };

  const afterResponse: Hook = {
    name: "log-after-response",
    priority: 1000,
    execute: (ctx) => {
      if (ctx.type !== "afterResponse" || !ctx.response || !ctx.request) return;
      if (!isEnabled(level, "info")) return;
      try {
        const res = ctx.response as HttpResponseEnvelope<unknown>;
        const req = ctx.request as { method?: unknown; url?: unknown };
        const urlStr = String((req as any).url ?? "");
        const u = urlStr ? new URL(urlStr) : undefined;
        const event: Record<string, unknown> = {
          ts: new Date().toISOString(),
          event: "http_response",
          phase: "afterResponse",
          operation: ctx.operation,
          method: req.method,
          url: includeQueryParams ? urlStr : (u ? `${u.origin}${u.pathname}` : urlStr),
          status: res.status,
          durationMs: res.meta?.durationMs,
          retryCount: res.meta?.retryCount,
          requestId: res.meta?.requestId,
          itemCount: computeItemCount(res.data),
        };
        logger("info", event);
      } catch {
        // swallow
      }
    },
  };

  const onError: Hook = {
    name: "log-on-error",
    priority: 1000,
    execute: (ctx) => {
      if (ctx.type !== "onError" || !ctx.error) return;
      if (!isEnabled(level, "error")) return;
      try {
        const err = ctx.error as any;
        const event: Record<string, unknown> = {
          ts: new Date().toISOString(),
          event: "http_error",
          phase: "onError",
          operation: ctx.operation,
          message: String(err?.message ?? err),
          code: err?.code,
          statusCode: err?.statusCode,
          requestId: err?.requestId,
          source: err?.source,
        };
        logger("error", event);
      } catch {
        // swallow
      }
    },
  };

  const onRetry: Hook = {
    name: "log-on-retry",
    priority: 1000,
    execute: (ctx) => {
      if (ctx.type !== "onRetry") return;
      if (!isEnabled(level, "debug")) return;
      try {
        const event: Record<string, unknown> = {
          ts: new Date().toISOString(),
          event: "http_retry",
          phase: "onRetry",
          operation: (ctx.metadata as any)?.operation ?? ctx.operation,
          attempt: (ctx.metadata as any)?.attempt,
        };
        logger("debug", event);
      } catch {
        // swallow
      }
    },
  };

  return {
    beforeRequest: [beforeRequest],
    afterResponse: [afterResponse],
    onError: [onError],
    onRetry: [onRetry],
  };
}