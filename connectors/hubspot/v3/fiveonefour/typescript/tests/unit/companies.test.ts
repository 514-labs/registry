import nock from "nock";
import { createHubSpotConnector } from "../../src";

const BASE = "https://api.hubapi.com";

describe("companies", () => {
  afterEach(() => nock.cleanAll());

  it("lists companies", async () => {
    nock(BASE)
      .get("/crm/v3/objects/companies")
      .query((q) => q.limit === "2" && q.properties === "name,domain")
      .reply(200, { results: [{ id: "c1" }], paging: { next: { after: "a" } } });

    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const list = await hs.listCompanies({ limit: 2, properties: ["name", "domain"] });
    expect(list.status).toBe(200);
    await hs.disconnect();
  });

  it("gets a company", async () => {
    nock(BASE)
      .get("/crm/v3/objects/companies/c1")
      .query((q) => q.properties === "name")
      .reply(200, { id: "c1", properties: { name: "Acme" } });

    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const one = await hs.getCompany({ id: "c1", properties: ["name"] });
    expect(one.data.id).toBe("c1");
    await hs.disconnect();
  });
});


