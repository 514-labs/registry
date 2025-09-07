import LineageContent from "@/content/docs/lineage.mdx";

export default function PipelineLineagePage() {
  return (
    <div className="prose dark:prose-invert prose-neutral max-w-none">
      <h1>Pipeline Lineage</h1>
      <LineageContent />

      <h2>Understanding Lineage</h2>
      <p>
        Data lineage tracks the flow of data through your pipeline, providing
        visibility into:
      </p>
      <ul>
        <li>Where data originates (source systems)</li>
        <li>How data is transformed</li>
        <li>Where data lands (destination systems)</li>
        <li>Dependencies between data elements</li>
      </ul>

      <h2>Lineage Manifest</h2>
      <p>
        Each pipeline includes a lineage manifest that describes the data flow:
      </p>
      <pre>
        <code>{`{
  "nodes": [
    {
      "id": "ga-source",
      "type": "source",
      "name": "Google Analytics",
      "namespace": "google-analytics",
      "version": "v4"
    },
    {
      "id": "transform-1",
      "type": "transformation",
      "name": "Normalize Events",
      "namespace": "pipeline"
    },
    {
      "id": "clickhouse-dest",
      "type": "destination", 
      "name": "ClickHouse Analytics",
      "namespace": "clickhouse"
    }
  ],
  "edges": [
    {
      "from": "ga-source",
      "to": "transform-1",
      "type": "data_flow"
    },
    {
      "from": "transform-1",
      "to": "clickhouse-dest",
      "type": "data_flow"
    }
  ]
}`}</code>
      </pre>

      <h2>Generating Lineage Diagrams</h2>
      <p>Use the provided scripts to generate visual lineage diagrams:</p>
      <pre>
        <code>{`# Generate Mermaid diagram
pnpm run generate:lineage:mermaid

# Generate SVG diagram
pnpm run generate:lineage:svg

# Generate interactive visualization
pnpm run generate:lineage:interactive`}</code>
      </pre>

      <h2>Lineage Schema References</h2>
      <p>
        Pipelines can reference connector schemas to build complete lineage:
      </p>
      <pre>
        <code>{`{
  "datasets": [
    {
      "kind": "pointer",
      "name": "GA Events",
      "connector": {
        "name": "google-analytics",
        "version": "v4",
        "author": "514-labs",
        "language": "typescript"
      }
    }
  ]
}`}</code>
      </pre>

      <h2>Benefits of Lineage Tracking</h2>
      <ul>
        <li>
          <strong>Impact analysis</strong> - Understand downstream effects of
          changes
        </li>
        <li>
          <strong>Debugging</strong> - Trace data issues to their source
        </li>
        <li>
          <strong>Compliance</strong> - Document data flows for regulatory
          requirements
        </li>
        <li>
          <strong>Documentation</strong> - Auto-generated visual documentation
        </li>
      </ul>
    </div>
  );
}
