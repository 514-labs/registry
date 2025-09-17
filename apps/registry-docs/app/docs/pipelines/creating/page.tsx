export default function CreatingPipelinesPage() {
  return (
    <div className="prose dark:prose-invert prose-neutral max-w-none">
      <h1>Creating Pipelines</h1>

      <p className="lead">
        Learn how to build end-to-end data pipelines that move data from source
        to destination.
      </p>

      <h2>What is a Pipeline?</h2>
      <p>A pipeline is a complete data flow solution that combines:</p>
      <ul>
        <li>
          <strong>Source connector</strong> - Extracts data from the source
          system
        </li>
        <li>
          <strong>Transformation logic</strong> - Processes and shapes the data
        </li>
        <li>
          <strong>Destination connector</strong> - Loads data into the target
          system
        </li>
        <li>
          <strong>Orchestration</strong> - Manages scheduling and execution
        </li>
      </ul>

      <h2>1. Clone the Repository</h2>
      <pre>
        <code>{`git clone https://github.com/514-labs/factory.git
cd factory`}</code>
      </pre>

      <h2>2. Generate Pipeline Scaffold</h2>
      <pre>
        <code>{`bash -i <(curl https://registry.514.ai/install.sh) --type pipeline \\
  google-analytics-to-clickhouse v1 myusername typescript`}</code>
      </pre>

      <h2>3. Define Your Pipeline</h2>
      <p>Navigate to your pipeline directory:</p>
      <pre>
        <code>{`cd pipeline-registry/google-analytics-to-clickhouse/v1/myusername/typescript/default`}</code>
      </pre>

      <h2>4. Configure Source and Destination</h2>
      <p>
        Edit the pipeline configuration in <code>_meta/pipeline.json</code>:
      </p>
      <pre>
        <code>{`{
  "source": {
    "connector": {
      "name": "google-analytics",
      "version": "v4",
      "author": "514-labs"
    }
  },
  "destination": {
    "system": "clickhouse",
    "database": "analytics",
    "table": "ga_events"
  },
  "schedule": {
    "cron": "0 */6 * * *",
    "timezone": "UTC"
  }
}`}</code>
      </pre>

      <h2>5. Implement Transformations</h2>
      <p>
        Add your transformation logic in <code>src/transform/</code>:
      </p>
      <pre>
        <code>{`export function transformGAEvent(event: GAEvent): ClickHouseEvent {
  return {
    timestamp: new Date(event.dateHour),
    userId: event.userId,
    sessionId: event.sessionId,
    eventName: event.eventName,
    eventParams: JSON.stringify(event.eventParams),
    // ... additional transformations
  };
}`}</code>
      </pre>

      <h2>6. Define Schema Mappings</h2>
      <p>
        Create schema definitions in <code>schemas/</code> that describe:
      </p>
      <ul>
        <li>Source data structure</li>
        <li>Transformation rules</li>
        <li>Destination table schema</li>
      </ul>

      <h2>7. Generate Lineage Diagram</h2>
      <pre>
        <code>{`pnpm run generate:lineage`}</code>
      </pre>

      <h2>8. Test Your Pipeline</h2>
      <pre>
        <code>{`pnpm test
pnpm run test:integration`}</code>
      </pre>

      <h2>Best Practices</h2>
      <ul>
        <li>
          <strong>Idempotency</strong> - Ensure transformations can be safely
          re-run
        </li>
        <li>
          <strong>Error handling</strong> - Implement robust error recovery
        </li>
        <li>
          <strong>Monitoring</strong> - Add logging and metrics
        </li>
        <li>
          <strong>Schema evolution</strong> - Plan for schema changes
        </li>
        <li>
          <strong>Performance</strong> - Optimize for your data volume
        </li>
      </ul>

      <h2>Next Steps</h2>
      <ul>
        <li>
          Explore the{" "}
          <a href="/docs/pipelines/specifications">pipeline specifications</a>
        </li>
        <li>
          Learn about <a href="/docs/pipelines/lineage">lineage tracking</a>
        </li>
        <li>
          Browse existing <a href="/discover">pipelines in the registry</a>
        </li>
      </ul>
    </div>
  );
}
