import { createHubSpotConnector } from "../../src";

// For paginate and streamContacts, the connector now uses SDK apiRequest or crm.contacts.basicApi
jest.mock("@hubspot/api-client", () => {
  const apiRequest = jest.fn();
  const mocked = { apiRequest, crm: { contacts: { basicApi: { getPage: jest.fn() } } } } as any;
  return { Client: jest.fn(() => mocked), __mocked: { mocked, apiRequest } };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { __mocked } = require("@hubspot/api-client");

describe("paginate (unit)", () => {
  beforeEach(() => {
    __mocked.apiRequest.mockReset();
  });

  it("iterates two pages using limit=1 and paging.next.after", async () => {
    __mocked.apiRequest
      .mockImplementationOnce(async () => ({ data: { results: [{ id: "1" }], paging: { next: { after: "next-1" } } } }))
      .mockImplementationOnce(async () => ({ data: { results: [{ id: "2" }] } }));

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
    // Connector streams via crm.contacts.basicApi.getPage; simulate two pages
    const getPage = __mocked.mocked.crm.contacts.basicApi.getPage as jest.Mock;
    getPage
      .mockResolvedValueOnce({ results: [{ id: "1" }], paging: { next: { after: "next-1" } } })
      .mockResolvedValueOnce({ results: [{ id: "2" }] });

    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const res = await hs.getContacts({ pageSize: 1 });
    expect(res.map((r: any) => r.id)).toEqual(["1", "2"]);
    await hs.disconnect();
  });

  it("streamContacts yields items one by one", async () => {
    const getPage = __mocked.mocked.crm.contacts.basicApi.getPage as jest.Mock;
    getPage
      .mockResolvedValueOnce({ results: [{ id: "a" }], paging: { next: { after: "after-a" } } })
      .mockResolvedValueOnce({ results: [{ id: "b" }] });

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


