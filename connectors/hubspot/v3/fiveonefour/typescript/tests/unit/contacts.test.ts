import { createHubSpotConnector } from "../../src";

jest.mock("@hubspot/api-client", () => {
  const getPage = jest.fn();
  const getById = jest.fn();
  const mocked = {
    crm: {
      contacts: { basicApi: { getPage, getById } },
    },
  } as any;
  return {
    Client: jest.fn(() => mocked),
    __mocked: { mocked, getPage, getById },
  };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { __mocked } = require("@hubspot/api-client");

describe("contacts", () => {
  beforeEach(() => {
    __mocked.getPage.mockReset();
    __mocked.getById.mockReset();
  });

  it("lists contacts with properties", async () => {
    __mocked.getPage.mockResolvedValue({ results: [{ id: "1", properties: { email: "a@example.com" } }] });

    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const res = await hs.listContacts({ limit: 5, properties: ["email", "firstname"] });
    expect(res.data.results.length).toBe(1);
    expect(__mocked.getPage).toHaveBeenCalledWith(5, undefined, ["email", "firstname"]);
    await hs.disconnect();
  });

  it("gets a contact by id", async () => {
    __mocked.getById.mockResolvedValue({ id: "123", properties: { email: "x@example.com" } });

    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "token" } } });
    await hs.connect();
    const res = await hs.getContact({ id: "123", properties: ["email"] });
    expect(res.data.id).toBe("123");
    expect(__mocked.getById).toHaveBeenCalledWith("123", ["email"]);
    await hs.disconnect();
  });
});


