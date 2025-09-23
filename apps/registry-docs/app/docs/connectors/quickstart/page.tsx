export default function ConnectorQuickstartPage() {
  return (
    <div className="prose dark:prose-invert prose-neutral max-w-none">
      <h1>Connector Quickstart</h1>

      <p className="lead">
        Get up and running with your first connector in under 5 minutes.
      </p>

      <h2>Prerequisites</h2>
      <ul>
        <li>Node.js 18+ and npm/pnpm installed</li>
        <li>Git installed</li>
        <li>Basic knowledge of TypeScript or Python</li>
      </ul>

      <h2>1. Clone the Repository</h2>
      <pre>
        <code>{`git clone https://github.com/514-labs/registry.git
cd registry`}</code>
      </pre>

      <h2>2. Generate Your Connector</h2>
      <p>Use our scaffold script to create a new connector:</p>
      <pre>
        <code>{`bash -i <(curl https://registry.514.ai/install.sh) \
  my-api v1 myusername typescript`}</code>
      </pre>

      <p>This creates a new connector with:</p>
      <ul>
        <li>
          <strong>Name</strong>: my-api
        </li>
        <li>
          <strong>Version</strong>: v1
        </li>
        <li>
          <strong>Author</strong>: myusername
        </li>
        <li>
          <strong>Language</strong>: typescript
        </li>
      </ul>

      <h2>3. Navigate to Your Connector</h2>
      <pre>
        <code>{`cd connector-registry/my-api/v1/myusername/typescript/default`}</code>
      </pre>

      <h2>4. Install Dependencies</h2>
      <pre>
        <code>{`pnpm install`}</code>
      </pre>

      <h2>5. Start Building</h2>
      <p>Your connector scaffold includes:</p>
      <ul>
        <li>
          <code>src/auth/</code> - Authentication logic
        </li>
        <li>
          <code>src/extract/</code> - Data extraction logic
        </li>
        <li>
          <code>src/transform/</code> - Data transformation logic
        </li>
        <li>
          <code>schemas/</code> - Schema definitions
        </li>
        <li>
          <code>tests/</code> - Unit tests
        </li>
      </ul>

      <h2>6. Test Your Connector</h2>
      <pre>
        <code>{`pnpm test`}</code>
      </pre>

      <h2>Next Steps</h2>
      <ul>
        <li>
          Read the <a href="/docs/connectors/specifications">specifications</a>{" "}
          for your connector type
        </li>
        <li>
          Explore existing connectors in the <a href="/discover">registry</a>
        </li>
        <li>
          Learn about{" "}
          <a href="/docs/connectors/creating">creating connectors</a> in depth
        </li>
      </ul>
    </div>
  );
}
