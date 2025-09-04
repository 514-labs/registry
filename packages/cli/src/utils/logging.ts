import type { ConnectorConfig } from "../config";

export function createDefaultLoggingHooks(): Required<NonNullable<ConnectorConfig["hooks"]>> {
  const beforeRequest = [
    {
      name: "log-before-request",
      priority: 1,
      execute(ctx: any) {
        const req = ctx.request ?? {};
        const safeHeaders = { ...(req.headers ?? {}) };
        if (safeHeaders.Authorization) safeHeaders.Authorization = "***";
        console.error("[beforeRequest]", ctx.operation ?? "", { method: req.method, url: req.url, headers: safeHeaders, body: req.body });
      },
    },
  ];
  const afterResponse = [
    {
      name: "log-after-response",
      priority: 1,
      execute(ctx: any) {
        const resp = ctx.response ?? {};
        console.error("[afterResponse]", ctx.operation ?? "", { status: resp.status, meta: resp.meta });
      },
    },
  ];
  const onError = [
    {
      name: "log-on-error",
      priority: 1,
      execute(ctx: any) {
        console.error("[onError]", ctx.operation ?? "", ctx.error);
      },
    },
  ];
  const onRetry = [
    {
      name: "log-on-retry",
      priority: 1,
      execute(ctx: any) {
        console.error("[onRetry]", ctx.metadata);
      },
    },
  ];

  return { beforeRequest, afterResponse, onError, onRetry } as any;
}

