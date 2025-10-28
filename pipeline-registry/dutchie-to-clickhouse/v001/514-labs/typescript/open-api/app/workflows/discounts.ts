import { Key, Task, Workflow } from "@514labs/moose-lib";
import { createDutchieConnector } from '../connectors/dutchie'
import { DiscountWithKey, DiscountPipeline } from '../ingest/models'
import { shouldAnonymize, anonymizeDiscount } from '../utils/anonymize'

export const getDiscountsTask = new Task<null, void>("getDiscountsTask", {
  run: async () => {
    const apiKey = process.env.DUTCHIE_API_KEY;
    if (!apiKey) throw new Error('DUTCHIE_API_KEY is required');

    const conn = createDutchieConnector();
    conn.initialize({
      auth: { type: 'basic', basic: { username: apiKey } },
      // logging: { enabled: true, level: 'info', includeBody: true },
    });

    const anonymize = shouldAnonymize();
    console.log(`Getting discounts from Dutchie (anonymization: ${anonymize ? 'enabled' : 'disabled'})`);
    
    for await (const page of conn.discounts.getAll({ paging: { pageSize: 50 } })) {
      let rows: DiscountWithKey[] = page
        .filter(d => d.id != null)
        .map(d => ({ ...d, id: d.id as Key<number> }));
      
      // Anonymize data if enabled
      if (anonymize) {
        rows = rows.map(row => anonymizeDiscount(row));
      }
      
      await DiscountPipeline.table!.insert(rows);
    }

    console.log('Discounts inserted into ClickHouse');
  },
  retries: 1,
  timeout: "30s",
});

export const getDiscountsWorkflow = new Workflow("getDiscounts", {
  startingTask: getDiscountsTask,
  retries: 1,
  timeout: "30s",
});
