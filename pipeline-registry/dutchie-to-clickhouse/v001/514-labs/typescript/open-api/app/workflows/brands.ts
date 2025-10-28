import { Key, Task, Workflow } from "@514labs/moose-lib";
import { createDutchieConnector } from '../connectors/dutchie'
import { BrandWithKey, BrandPipeline } from '../ingest/models'
import { shouldAnonymize, anonymizeBrand } from '../utils/anonymize'

export const getBrandsTask = new Task<null, void>("getBrandsTask", {
  run: async () => {
    const apiKey = process.env.DUTCHIE_API_KEY;
    if (!apiKey) throw new Error('DUTCHIE_API_KEY is required');

    const conn = createDutchieConnector();
    conn.initialize({
      auth: { type: 'basic', basic: { username: apiKey } },
      // logging: { enabled: true, level: 'info', includeBody: true },
    });

    const anonymize = shouldAnonymize();
    console.log(`Getting brands from Dutchie (anonymization: ${anonymize ? 'enabled' : 'disabled'})`);
    
    for await (const page of conn.brand.getAll({ paging: { pageSize: 50 } })) {
      let rows: BrandWithKey[] = page
        .filter(b => b.brandId != null)
        .map(b => ({ ...b, brandId: b.brandId as Key<number> }));
      
      // Anonymize data if enabled
      if (anonymize) {
        rows = rows.map(row => anonymizeBrand(row));
      }
      
      await BrandPipeline.table!.insert(rows);
    }

    console.log('Brands inserted into ClickHouse');
  },
  retries: 1,
  timeout: "30s",
});

export const getBrandsWorkflow = new Workflow("getBrands", {
  startingTask: getBrandsTask,
  retries: 1,
  timeout: "30s",
});