import type { Hook, RequestContext, ResponseContext } from "../connector/jsonplaceholder";

function getLogLevel(): "debug" | "info" | "warn" | "error" {
  const v = (process.env.LOG_LEVEL ?? "info").toLowerCase();
  if (v === "debug" || v === "info" || v === "warn" || v === "error") return v;
  return "info";
}

const shouldLogDebug = () => getLogLevel() === "debug";

export function createLoggingHook(): Hook {
  return {
    beforeRequest: (req: RequestContext) => {
      if (shouldLogDebug()) {
        console.log("[hook] beforeRequest", { url: req.url, method: req.method, headers: req.headers });
      }
    },
    afterResponse: (res: ResponseContext<unknown>, req: RequestContext) => {
      const level = res.status >= 400 ? "warn" : "info";
      const log = level === "warn" ? console.warn : console.log;
      log("[hook] afterResponse", {
        url: req.url,
        status: res.status,
        durationMs: Math.round(res.meta.durationMs),
      });
    },
    onError: (error: unknown, req: RequestContext) => {
      console.error("[hook] onError", { url: req.url, error: String(error) });
    },
  };
}