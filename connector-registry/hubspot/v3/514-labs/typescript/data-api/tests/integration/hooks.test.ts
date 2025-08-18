/* eslint-env jest */
/* global describe, it, expect */
import { createHubSpotConnector } from "../../src";
import type { Hook } from "../../src/types/hooks";

// This integration test demonstrates the hook system working end-to-end against live HubSpot.
// Preconditions:
// - Set HUBSPOT_TOKEN in your environment with a Private App token that has crm.objects.contacts.read.
// - The test will be skipped automatically when HUBSPOT_TOKEN is not set.

const token = process.env.HUBSPOT_TOKEN;
const itif = token ? it : it.skip;

describe("hooks integration (live)", () => {
  itif("transforms contacts via afterResponse hook (adds fullName)", async () => {
    // Arrange: create connector and register an afterResponse hook that maps the raw HubSpot response
    // into a simplified shape. We verify the hook executes by asserting on the transformed structure.
    const hs = createHubSpotConnector();
    const transformHook: Hook = {
      name: "map-contacts",
      priority: 10,
      execute(ctx) {
        if (ctx.type !== "afterResponse" || !ctx.response) return;
        const resp: any = ctx.response;
        const results = Array.isArray(resp.data?.results) ? resp.data.results : [];
        const mapped = results.map((r: any) => {
          const firstName = r.properties?.firstname as string | undefined;
          const lastName = r.properties?.lastname as string | undefined;
          const fullName = [firstName, lastName].filter(Boolean).join(" ");
          return {
            id: r.id,
            email: r.properties?.email,
            firstName,
            lastName,
            fullName,
            createdAt: r.createdAt,
          };
        });
        // mutate the response via modifyResponse to replace the data payload
        ctx.modifyResponse?.({ data: { items: mapped } as any });
      },
    };
    hs.initialize({ auth: { type: "bearer", bearer: { token: token! } }, hooks: { afterResponse: [transformHook] } });

    // Act: call listContacts with minimal properties to keep payload small
    await hs.connect();
    const res = await hs.listContacts({ limit: 5, properties: ["email", "firstname", "lastname"] });

    // Assert: status OK and hook-transformed payload present
    expect(res.status).toBe(200);
    expect((res.data as any).items).toBeDefined();
    const first = (res.data as any).items?.[0];
    if (first) {
      expect(first).toHaveProperty("email");
      expect(first).toHaveProperty("firstName");
      expect(first).toHaveProperty("lastName");
      expect(first).toHaveProperty("fullName");
      if (first.firstName && first.lastName) {
        expect(first.fullName).toBe(`${first.firstName} ${first.lastName}`);
      }
    }
    await hs.disconnect();
  });

  itif("iterates contacts with pageSize=1 using convenience method", async () => {
    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: token! } } });
    await hs.connect();
    const items = await hs.getContacts({ pageSize: 1, maxItems: 2 });
    expect(items.length).toBeGreaterThanOrEqual(1);
    await hs.disconnect();
  });
});


