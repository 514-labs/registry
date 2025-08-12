import { createHubSpotConnector } from "../../src";

jest.mock("@hubspot/api-client", () => {
  const getPage = jest.fn();
  const getById = jest.fn();
  const mocked = {
    crm: {
      companies: { basicApi: { getPage, getById } },
    },
  } as any;
  return { Client: jest.fn(() => mocked), __mocked: { mocked, getPage, getById } };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { __mocked } = require("@hubspot/api-client");

describe("companies", () => {
  beforeEach(() => {
    __mocked.getPage.mockReset();
    __mocked.getById.mockReset();
  });

  it("lists companies", async () => {
    __mocked.getPage.mockResolvedValue({ results: [{ id: "c1" }], paging: { next: { after: "a" } } });
    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const list = await hs.listCompanies({ limit: 2, properties: ["name", "domain"] });
    expect(list.data.results[0].id).toBe("c1");
    await hs.disconnect();
  });

  it("gets a company", async () => {
    __mocked.getById.mockResolvedValue({ id: "c1", properties: { name: "Acme" } });
    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const one = await hs.getCompany({ id: "c1", properties: ["name"] });
    expect(one.data.id).toBe("c1");
    await hs.disconnect();
  });

  it("getCompanies aggregates across pages", async () => {
    __mocked.getPage
      .mockResolvedValueOnce({ results: [{ id: "c1" }], paging: { next: { after: "next" } } })
      .mockResolvedValueOnce({ results: [{ id: "c2" }] });
    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const all = await hs.getCompanies({ pageSize: 1 });
    expect(all.map((x: any) => x.id)).toEqual(["c1", "c2"]);
    await hs.disconnect();
  });
});


