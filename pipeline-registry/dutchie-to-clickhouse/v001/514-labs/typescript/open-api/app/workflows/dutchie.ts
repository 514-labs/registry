import { Key, Task, Workflow } from "@514labs/moose-lib";
import { createDutchieConnector } from '../connectors/dutchie'
// import { BrandWithKey, BrandPipeline } from '../ingest/models'
import { DiscountWithKey, DiscountPipeline } from '../ingest/models'

export const dutchietask = new Task<null, void>("testdutchietask", {
  run: async () => {
    const apiKey = process.env.DUTCHIE_API_KEY;
    if (!apiKey) throw new Error('DUTCHIE_API_KEY is required');

    const conn = createDutchieConnector();
    conn.initialize({
      auth: { type: 'basic', basic: { username: apiKey } },
      logging: { enabled: true, level: 'info', includeBody: true },
    });

    console.log('Getting discounts from Dutchie');
    for await (const page of conn.discounts.getAll({ paging: { pageSize: 50 } })) {
      const rows: DiscountWithKey[] = page
        .filter(d => d.id != null)
        .map(d => ({ ...d, id: d.id as Key<number> }));
      console.log("=======================================================")
      console.log('Rows:', JSON.stringify(rows, null, 2));
      console.log("=======================================================")
      await DiscountPipeline.table!.insert(rows);
    }

    console.log('Discounts inserted into ClickHouse');
  },
  retries: 1,
  timeout: "30s",
});

export const dutchieworkflow = new Workflow("testdutchie", {
  startingTask: dutchietask,
  retries: 1,
  timeout: "30s",
});
