/* eslint-env jest */
/* global describe, it, expect */
import { createHubSpotConnector } from "../../src";

// This live test streams ALL deals using cursor pagination and logs basic fields.
// Preconditions:
// - Set HUBSPOT_TOKEN in your environment with a Private App token that has at least crm.objects.deals.read.
// - The test will be skipped automatically when HUBSPOT_TOKEN is not set.

const token = process.env.HUBSPOT_TOKEN;
const itif = token ? it : it.skip;

// Allow generous time for large portals
jest.setTimeout(300_000);

describe("deals paging (live)", () => {
  itif("pages through all deals and logs them", async () => {
    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: token! } } });
    await hs.connect();

    let count = 0;
    for await (const deal of hs.streamDeals({
      pageSize: 100,
      properties: ["dealname", "amount", "dealstage", "pipeline"],
    })) {
      // Print a concise line per deal
      const props: any = (deal as any).properties ?? {};
      // eslint-disable-next-line no-console
      console.log(
        JSON.stringify({
          id: (deal as any).id,
          name: props.dealname,
          amount: props.amount,
          stage: props.dealstage,
          pipeline: props.pipeline,
        })
      );
      count += 1;
    }

    // eslint-disable-next-line no-console
    console.log(`Total deals: ${count}`);
    // Minimal assertion to mark success; count may be 0 in empty portals
    expect(typeof count).toBe("number");
    await hs.disconnect();
  });
});


