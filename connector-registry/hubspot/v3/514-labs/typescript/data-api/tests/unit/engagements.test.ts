import nock from "nock";
import { createHubSpotConnector } from "../../src";

const BASE = "https://api.hubapi.com";

describe("engagements (activities)", () => {
  afterEach(() => nock.cleanAll());

  it("lists and gets notes", async () => {
    nock(BASE)
      .get("/crm/v3/objects/notes")
      .query((q) => q.limit === "1")
      .reply(200, { results: [{ id: "n1" }] });
    nock(BASE).get("/crm/v3/objects/notes/n1").reply(200, { id: "n1" });

    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();

    const list = await hs.listEngagements({ objectType: "notes", limit: 1 });
    expect(list.data.results[0].id).toBe("n1");
    const one = await hs.getEngagement({ objectType: "notes", id: "n1" });
    expect(one.status).toBe(200);
    await hs.disconnect();
  });

  it("getEngagements aggregates across pages for notes", async () => {
    nock(BASE)
      .get("/crm/v3/objects/notes")
      .query((q) => q.limit === "1" && (q.after === undefined || q.after === ""))
      .reply(200, { results: [{ id: "n1" }], paging: { next: { after: "n" } } });
    nock(BASE)
      .get("/crm/v3/objects/notes")
      .query((q) => q.limit === "1" && q.after === "n")
      .reply(200, { results: [{ id: "n2" }] });

    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const all = await hs.getEngagements({ objectType: "notes", pageSize: 1 });
    expect(all.map((x) => x.id)).toEqual(["n1", "n2"]);
    await hs.disconnect();
  });
});


