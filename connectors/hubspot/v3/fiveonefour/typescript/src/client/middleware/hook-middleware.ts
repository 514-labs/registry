import type { Hook, HookContext, HookType } from "../../types/hooks";
import type { HttpResponseEnvelope } from "../../types/envelopes";

export function applyHookPipeline(
  hooks: Partial<Record<HookType, Hook[]>>,
  opName: string,
  buildCtx: (type: HookType) => HookContext
) {
  const ordered = (type: HookType) => [...(hooks[type] ?? [])].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  return {
    async beforeRequest(): Promise<void> {
      for (const h of ordered("beforeRequest")) await h.execute(buildCtx("beforeRequest"));
    },
    async afterResponse(resp: HttpResponseEnvelope<unknown>): Promise<void> {
      const ctx = buildCtx("afterResponse");
      ctx.response = resp;
      ctx.modifyResponse = (updates) => {
        Object.assign(resp, updates);
      };
      for (const h of ordered("afterResponse")) await h.execute(ctx);
    },
    async onError(err: unknown): Promise<void> {
      const ctx = buildCtx("onError");
      ctx.error = err;
      for (const h of ordered("onError")) await h.execute(ctx);
    },
    async onRetry(attempt: number): Promise<void> {
      const ctx = buildCtx("onRetry");
      ctx.metadata = { attempt, operation: opName };
      for (const h of ordered("onRetry")) await h.execute(ctx);
    },
  };
}


