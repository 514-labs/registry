import { createHubSpotConnector } from "../../src";

describe("hubspot lifecycle", () => {
  it("initialize/connect/disconnect", async () => {
    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "x" } } });
    expect(hs.isConnected()).toBe(false);
    await hs.connect();
    expect(hs.isConnected()).toBe(true);
    await hs.disconnect();
    expect(hs.isConnected()).toBe(false);
  });
});


