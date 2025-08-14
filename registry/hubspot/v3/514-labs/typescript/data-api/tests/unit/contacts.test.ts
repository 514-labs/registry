import nock from "nock";
import { createHubSpotConnector } from "../../src";

const BASE = "https://api.hubapi.com";

describe("contacts", () => {
  afterEach(() => nock.cleanAll());

  it("lists contacts with properties", async () => {
    const scope = nock(BASE)
      .get("/crm/v3/objects/contacts")
      .query((q) => q.limit === "5" && q.properties === "email,firstname")
      .reply(200, { results: [{ id: "1", properties: { email: "a@example.com" } }] }, {
        "X-Request-Id": "req-1",
      });

    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const res = await hs.listContacts({ limit: 5, properties: ["email", "firstname"] });
    expect(res.status).toBe(200);
    expect(res.data.results.length).toBe(1);
    expect(res.meta?.requestId).toBe("req-1");
    await hs.disconnect();
    expect(scope.isDone()).toBe(true);
  });

  it("gets a contact by id", async () => {
    const scope = nock(BASE)
      .get("/crm/v3/objects/contacts/123")
      .query((q) => q.properties === "email")
      .reply(200, { id: "123", properties: { email: "x@example.com" } });

    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const res = await hs.getContact({ id: "123", properties: ["email"] });
    expect(res.status).toBe(200);
    expect(res.data.id).toBe("123");
    await hs.disconnect();
    expect(scope.isDone()).toBe(true);
  });
});


