import type {
  Hook,
  HookContext,
  HookType,
  BeforeRequestContext,
  AfterResponseContext,
  OnErrorContext,
  OnRetryContext,
} from '../types/hooks';
import type { HttpResponseEnvelope } from '../types/envelopes';

export function applyHookPipeline(
  hooks: Partial<Record<HookType, Hook[]>>,
  opName: string,
  buildCtx: (type: HookType) => HookContext
) {
  const ordered = (type: HookType) => [...(hooks[type] ?? [])].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  return {
    async beforeRequest(): Promise<void> {
      const ctx = buildCtx('beforeRequest') as BeforeRequestContext;
      for (const h of ordered('beforeRequest')) await h.execute(ctx);
    },
    async afterResponse(resp: HttpResponseEnvelope<unknown>): Promise<void> {
      const ctxBase = buildCtx('afterResponse') as HookContext as any;
      ctxBase.response = resp;
      ctxBase.modifyResponse = (updates: Partial<HttpResponseEnvelope<unknown>>) => {
        Object.assign(resp, updates);
      };
      const ctx = ctxBase as AfterResponseContext;
      for (const h of ordered('afterResponse')) await h.execute(ctx);
    },
    async onError(err: unknown): Promise<void> {
      const ctxBase = buildCtx('onError') as HookContext as any;
      ctxBase.error = err;
      const ctx = ctxBase as OnErrorContext;
      for (const h of ordered('onError')) await h.execute(ctx);
    },
    async onRetry(attempt: number): Promise<void> {
      const ctx = buildCtx('onRetry') as OnRetryContext;
      ctx.metadata = { attempt, operation: opName };
      for (const h of ordered('onRetry')) await h.execute(ctx);
    },
  };
}
 
