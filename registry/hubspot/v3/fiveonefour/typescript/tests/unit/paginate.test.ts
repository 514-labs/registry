import nock from "nock";
import { createHubSpotConnector } from "../../src";

const BASE = "https://api.hubapi.com";

describe("paginate (unit)", () => {
  afterEach(() => nock.cleanAll());

  it("iterates two pages using limit=1 and paging.next.after", async () => {
    // Page 1
    const afterToken = "next-1";
    nock(BASE)
      .get("/crm/v3/objects/contacts")
      .query((q) => q.limit === "1" && (q.after === undefined || q.after === ""))
      .reply(200, {
        results: [{ id: "1", properties: { email: "a@example.com" } }],
        paging: { next: { after: afterToken } },
      });

    // Page 2
    nock(BASE)
      .get("/crm/v3/objects/contacts")
      .query((q) => q.limit === "1" && q.after === afterToken)
      .reply(200, {
        results: [{ id: "2", properties: { email: "b@example.com" } }],
      });

    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();

    const pages: any[][] = [];
    for await (const items of hs.paginate<any>({ path: "/crm/v3/objects/contacts", pageSize: 1 })) {
      pages.push(items);
      if (pages.length >= 2) break; // stop after two pages
    }

    expect(pages.length).toBe(2);
    expect(pages[0][0].id).toBeDefined();
    expect(pages[1][0].id).toBeDefined();
    await hs.disconnect();
  });

  it("getContacts aggregates across pages", async () => {
    // page 1
    nock(BASE)
      .get("/crm/v3/objects/contacts")
      .query((q) => q.limit === "1" && (q.after === undefined || q.after === ""))
      .reply(200, { results: [{ id: "1" }], paging: { next: { after: "next-1" } } });
    // page 2
    nock(BASE)
      .get("/crm/v3/objects/contacts")
      .query((q) => q.limit === "1" && q.after === "next-1")
      .reply(200, { results: [{ id: "2" }] });

    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const res = await hs.getContacts({ pageSize: 1 });
    expect(res.map((r) => r.id)).toEqual(["1", "2"]);
    await hs.disconnect();
  });

  it("streamContacts yields items one by one", async () => {
    // page 1
    nock(BASE)
      .get("/crm/v3/objects/contacts")
      .query((q) => q.limit === "1" && (q.after === undefined || q.after === ""))
      .reply(200, { results: [{ id: "a" }], paging: { next: { after: "after-a" } } });
    // page 2
    nock(BASE)
      .get("/crm/v3/objects/contacts")
      .query((q) => q.limit === "1" && q.after === "after-a")
      .reply(200, { results: [{ id: "b" }] });

    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const seen: string[] = [];
    for await (const item of hs.streamContacts({ pageSize: 1 })) {
      seen.push(item.id);
    }
    expect(seen).toEqual(["a", "b"]);
    await hs.disconnect();
  });
});


