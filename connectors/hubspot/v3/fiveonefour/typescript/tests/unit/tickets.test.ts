import nock from "nock";
import { createHubSpotConnector } from "../../src";

const BASE = "https://api.hubapi.com";

describe("tickets", () => {
  afterEach(() => nock.cleanAll());

  it("lists tickets", async () => {
    nock(BASE)
      .get("/crm/v3/objects/tickets")
      .query((q) => q.limit === "1")
      .reply(200, { results: [{ id: "t1" }] });

    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const list = await hs.listTickets({ limit: 1 });
    expect(list.data.results[0].id).toBe("t1");
    await hs.disconnect();
  });

  it("gets a ticket", async () => {
    nock(BASE).get("/crm/v3/objects/tickets/t1").reply(200, { id: "t1" });
    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const one = await hs.getTicket({ id: "t1" });
    expect(one.status).toBe(200);
    await hs.disconnect();
  });
});


