import nock from "nock";
import { createHubSpotConnector } from "../../src";

const BASE = "https://api.hubapi.com";

describe("deals", () => {
  afterEach(() => nock.cleanAll());

  it("lists deals", async () => {
    nock(BASE)
      .get("/crm/v3/objects/deals")
      .query((q) => q.limit === "1")
      .reply(200, { results: [{ id: "d1" }] });

    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const list = await hs.listDeals({ limit: 1 });
    expect(list.data.results[0].id).toBe("d1");
    await hs.disconnect();
  });

  it("gets a deal", async () => {
    nock(BASE).get("/crm/v3/objects/deals/d1").reply(200, { id: "d1" });
    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const one = await hs.getDeal({ id: "d1" });
    expect(one.status).toBe(200);
    await hs.disconnect();
  });

  it("getDeals aggregates across pages", async () => {
    nock(BASE)
      .get("/crm/v3/objects/deals")
      .query((q) => q.limit === "1" && (q.after === undefined || q.after === ""))
      .reply(200, { results: [{ id: "d1" }], paging: { next: { after: "n" } } });
    nock(BASE)
      .get("/crm/v3/objects/deals")
      .query((q) => q.limit === "1" && q.after === "n")
      .reply(200, { results: [{ id: "d2" }] });

    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const all = await hs.getDeals({ pageSize: 1 });
    expect(all.map((x) => x.id)).toEqual(["d1", "d2"]);
    await hs.disconnect();
  });
});


