/* eslint-env jest */
/* global describe, it, expect */
import { createHubSpotConnector } from "../../src";
import type { Hook } from "../../src/types/hooks";

// Preconditions:
// - Set HUBSPOT_TOKEN in your environment with a Private App token that has crm.objects.deals.read.
// - The tests will be skipped automatically when HUBSPOT_TOKEN is not set.

const token = process.env.HUBSPOT_TOKEN;
const itif = token ? it : it.skip;

describe("deals hooks integration (live)", () => {
  itif("transforms deals via afterResponse hook (adds amountNumber)", async () => {
    const hs = createHubSpotConnector();
    const transformHook: Hook = {
      name: "map-deals",
      priority: 10,
      execute(ctx) {
        if (ctx.type !== "afterResponse" || !ctx.response) return;
        const resp: any = ctx.response;
        const results = Array.isArray(resp.data?.results) ? resp.data.results : [];
        const mapped = results.map((r: any) => {
          const amountStr = r.properties?.amount as string | undefined;
          const amountNumber = amountStr ? Number(amountStr) : undefined;
          return {
            id: r.id,
            amount: amountStr,
            amountNumber,
            stage: r.properties?.dealstage,
            createdAt: r.createdAt,
          };
        });
        ctx.modifyResponse?.({ data: { items: mapped } as any });
      },
    };
    hs.initialize({ auth: { type: "bearer", bearer: { token: token! } }, hooks: { afterResponse: [transformHook] } });

    await hs.connect();
    const res = await hs.listDeals({ limit: 5, properties: ["amount", "dealstage"] });
    expect(res.status).toBe(200);
    expect((res.data as any).items).toBeDefined();
    const first = (res.data as any).items?.[0];
    if (first) {
      expect(first).toHaveProperty("amount");
      expect(first).toHaveProperty("amountNumber");
      expect(first).toHaveProperty("stage");
      if (first.amount) {
        expect(Number.isNaN(first.amountNumber)).toBe(false);
      }
    }
    await hs.disconnect();
  });

  itif("iterates deals with pageSize=1 using convenience method", async () => {
    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: token! } } });
    await hs.connect();
    const items = await hs.getDeals({ pageSize: 1, maxItems: 2 });
    expect(items.length).toBeGreaterThanOrEqual(1);
    await hs.disconnect();
  });
});


