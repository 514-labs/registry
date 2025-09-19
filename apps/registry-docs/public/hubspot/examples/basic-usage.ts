import { createHubSpotConnector } from "../src";

async function main() {
  const hubspot = createHubSpotConnector();

  hubspot.initialize({
    auth: { type: "bearer", bearer: { token: process.env.HUBSPOT_TOKEN || "" } },
  });
  await hubspot.connect();

  let count = 0;
  for await (const c of hubspot.streamContacts({ pageSize: 50 })) {
    console.log(c.properties);
    if (++count >= 5) break;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
