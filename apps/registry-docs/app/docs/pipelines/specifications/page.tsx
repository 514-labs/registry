export default function PipelineSpecificationsPage() {
  return (
    <div className="prose dark:prose-invert prose-neutral max-w-none">
      <h1>Pipeline Specifications</h1>

      <p className="lead">
        Technical specifications and requirements for building production-ready
        data pipelines.
      </p>

      <h2>Pipeline Types</h2>

      <h3>ETL (Extract, Transform, Load)</h3>
      <ul>
        <li>Data is extracted from source</li>
        <li>Transformed in the pipeline</li>
        <li>Loaded into destination</li>
        <li>Best for: Complex transformations, data cleansing</li>
      </ul>

      <h3>ELT (Extract, Load, Transform)</h3>
      <ul>
        <li>Data is extracted from source</li>
        <li>Loaded into destination as-is</li>
        <li>Transformed in the destination system</li>
        <li>Best for: Cloud data warehouses, simple transformations</li>
      </ul>

      <h3>Reverse ETL</h3>
      <ul>
        <li>Data flows from warehouse back to operational systems</li>
        <li>Syncs analytical insights to business tools</li>
        <li>Best for: Customer data activation, operational analytics</li>
      </ul>

      <h3>Streaming</h3>
      <ul>
        <li>Real-time or near-real-time data processing</li>
        <li>Continuous data flow</li>
        <li>Best for: Event data, monitoring, real-time analytics</li>
      </ul>

      <h3>CDC (Change Data Capture)</h3>
      <ul>
        <li>Captures only changed data from source</li>
        <li>Maintains data freshness with minimal load</li>
        <li>Best for: Database replication, incremental updates</li>
      </ul>

      <h2>Required Components</h2>

      <h3>1. Pipeline Metadata</h3>
      <pre>
        <code>{`{
  "$schema": "https://registry.514.ai/schemas/pipeline.json",
  "name": "Google Analytics to ClickHouse",
  "identifier": "google-analytics-to-clickhouse",
  "description": "Sync Google Analytics data to ClickHouse for analysis",
  "type": "elt",
  "schedule": {
    "cron": "0 */6 * * *",
    "timezone": "UTC"
  }
}`}</code>
      </pre>

      <h3>2. Source Configuration</h3>
      <pre>
        <code>{`{
  "source": {
    "connector": {
      "name": "google-analytics",
      "version": "v4",
      "author": "514-labs",
      "language": "typescript",
      "implementation": "default"
    },
    "config": {
      "propertyId": "{{GA_PROPERTY_ID}}",
      "startDate": "30daysAgo",
      "dimensions": ["date", "country", "deviceCategory"],
      "metrics": ["sessions", "users", "pageviews"]
    }
  }
}`}</code>
      </pre>

      <h3>3. Transformation Rules</h3>
      <pre>
        <code>{`{
  "transformations": [
    {
      "type": "rename",
      "field": "ga:date",
      "to": "event_date"
    },
    {
      "type": "cast",
      "field": "sessions",
      "to": "UInt32"
    },
    {
      "type": "derive",
      "field": "bounce_rate",
      "expression": "bounces / sessions"
    }
  ]
}`}</code>
      </pre>

      <h3>4. Destination Configuration</h3>
      <pre>
        <code>{`{
  "destination": {
    "system": "clickhouse",
    "config": {
      "host": "{{CLICKHOUSE_HOST}}",
      "database": "analytics",
      "table": "ga_events",
      "engine": "MergeTree()",
      "orderBy": ["event_date", "country"]
    }
  }
}`}</code>
      </pre>

      <h3>5. Schema Definitions</h3>
      <ul>
        <li>Source schema (from connector)</li>
        <li>Transformation schema</li>
        <li>Destination schema</li>
        <li>Lineage manifest</li>
      </ul>

      <h3>6. Error Handling</h3>
      <ul>
        <li>Retry logic with exponential backoff</li>
        <li>Dead letter queues for failed records</li>
        <li>Alerting on failures</li>
        <li>Data quality checks</li>
      </ul>

      <h3>7. Monitoring & Observability</h3>
      <ul>
        <li>Execution logs</li>
        <li>Performance metrics</li>
        <li>Data volume tracking</li>
        <li>Lineage visualization</li>
      </ul>

      <h2>Best Practices</h2>

      <h3>Performance</h3>
      <ul>
        <li>Batch data appropriately</li>
        <li>Use incremental loads where possible</li>
        <li>Implement proper indexing</li>
        <li>Monitor memory usage</li>
      </ul>

      <h3>Reliability</h3>
      <ul>
        <li>Make transformations idempotent</li>
        <li>Handle schema evolution</li>
        <li>Implement checkpointing</li>
        <li>Test failure scenarios</li>
      </ul>

      <h3>Security</h3>
      <ul>
        <li>Encrypt data in transit</li>
        <li>Mask sensitive fields</li>
        <li>Use secure credential storage</li>
        <li>Implement access controls</li>
      </ul>

      <h2>Testing Requirements</h2>
      <ul>
        <li>Unit tests for transformations</li>
        <li>Integration tests with sample data</li>
        <li>Schema validation tests</li>
        <li>Performance benchmarks</li>
        <li>End-to-end pipeline tests</li>
      </ul>
    </div>
  );
}
