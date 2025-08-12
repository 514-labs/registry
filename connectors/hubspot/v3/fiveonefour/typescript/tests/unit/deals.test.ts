import { createHubSpotConnector } from "../../src";

jest.mock("@hubspot/api-client", () => {
  const getPage = jest.fn();
  const getById = jest.fn();
  const mocked = {
    crm: {
      deals: { basicApi: { getPage, getById } },
    },
  } as any;
  return { Client: jest.fn(() => mocked), __mocked: { mocked, getPage, getById } };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { __mocked } = require("@hubspot/api-client");

describe("deals", () => {
  beforeEach(() => {
    __mocked.getPage.mockReset();
    __mocked.getById.mockReset();
  });

  it("lists deals", async () => {
    __mocked.getPage.mockResolvedValue({ results: [{ id: "d1" }] });
    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const list = await hs.listDeals({ limit: 1 });
    expect(list.data.results[0].id).toBe("d1");
    await hs.disconnect();
  });

  it("gets a deal", async () => {
    __mocked.getById.mockResolvedValue({ id: "d1" });
    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const one = await hs.getDeal({ id: "d1" });
    expect(one.data.id).toBe("d1");
    await hs.disconnect();
  });

  it("getDeals aggregates across pages", async () => {
    __mocked.getPage
      .mockResolvedValueOnce({ results: [{ id: "d1" }], paging: { next: { after: "n" } } })
      .mockResolvedValueOnce({ results: [{ id: "d2" }] });
    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const all = await hs.getDeals({ pageSize: 1 });
    expect(all.map((x: any) => x.id)).toEqual(["d1", "d2"]);
    await hs.disconnect();
  });
});


