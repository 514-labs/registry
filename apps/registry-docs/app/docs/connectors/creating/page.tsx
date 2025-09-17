import Link from "next/link";

export default function CreatingConnectorsPage() {
  return (
    <div className="prose dark:prose-invert prose-neutral max-w-none">
      <h1>Creating Connectors</h1>

      <p className="lead">
        Follow these steps to create your own connector and contribute to the
        registry.
      </p>

      <h2>1. Clone the repository</h2>
      <p>Clone the factory repository to your local machine:</p>
      <pre>
        <code>{`git clone https://github.com/514-labs/factory.git
cd factory`}</code>
      </pre>

      <h2>2. Generate a connector scaffold</h2>
      <p>
        From the factory directory, run the install script to generate a new
        connector with the appropriate structure:
      </p>
      <pre>
        <code>{`bash -i <(curl https://registry.514.ai/install.sh) --type connector [connector-name] [version] [author] [language]`}</code>
      </pre>

      <p>
        <strong>Example:</strong>
      </p>
      <pre>
        <code>{`bash -i <(curl https://registry.514.ai/install.sh) --type connector ads-b-dot-lol v2 fiveonefour typescript data-api`}</code>
      </pre>

      <p>
        This creates a new directory with your connector scaffold in the chosen
        language.
      </p>

      <h2>3. Determine your connector type</h2>
      <p>Identify which type of connector you're building:</p>
      <ul>
        <li>
          <strong>API Connector</strong>: For general REST/GraphQL APIs
        </li>
        <li>
          <strong>SaaS Connector</strong>: For third-party SaaS platforms and
          services
        </li>
        <li>
          <strong>Database Connector</strong>: For SQL databases (PostgreSQL,
          MySQL, etc.)
        </li>
        <li>
          <strong>Blob Storage Connector</strong>: For cloud storage (S3, GCS,
          Azure Blob)
        </li>
      </ul>

      <h2>4. Follow the specifications</h2>
      <p>Feed your LLM the relevant specifications and documentation:</p>

      <ol>
        <li>
          <strong>Target API documentation</strong>: Share the official API docs
          of the service you're connecting to (e.g.,{" "}
          <a href="https://stripe.com/docs/api" target="_blank">
            Stripe API docs
          </a>
          ,
          <a href="https://shopify.dev/docs/api" target="_blank">
            Shopify API docs
          </a>
          )
        </li>
        <li>
          <strong>Type-specific specs</strong>: Include the appropriate
          specification:
          <ul>
            <li>
              <Link href="/docs/connectors/specifications">
                API Connector Spec
              </Link>{" "}
              for general REST/GraphQL APIs
            </li>
            <li>
              <Link href="/docs/connectors/specifications">
                SaaS Connector Spec
              </Link>{" "}
              for third-party SaaS platforms
            </li>
            <li>
              <Link href="/docs/connectors/specifications">
                Database Connector Spec
              </Link>{" "}
              for SQL databases
            </li>
            <li>
              <Link href="/docs/connectors/specifications">
                Blob Storage Connector Spec
              </Link>{" "}
              for cloud storage
            </li>
          </ul>
        </li>
        <li>
          <strong>Example connectors</strong>: Reference existing connectors in
          the registry for patterns
          <ul>
            <li>API Connectors: ADS-B.lol, OpenWeather</li>
            <li>
              SaaS Connectors:{" "}
              <a href="/connector-registry/google-analytics/v4/fiveonefour/typescript/README.md">
                Google Analytics
              </a>
              ,
              <a href="/connector-registry/shopify/v2025-01/fiveonefour/typescript/README.md">
                Shopify
              </a>
            </li>
            <li>[coming soon] Database Connectors: PostgreSQL</li>
            <li>[coming soon] Blob Storage Connectors: S3</li>
          </ul>
        </li>
      </ol>

      <p>
        Your LLM can then help generate the connector implementation following
        the established patterns and specifications.
      </p>

      <h2>5. Implement core functionality</h2>
      <p>Focus on these key areas:</p>
      <ul>
        <li>
          <strong>Authentication</strong>: Implement secure authentication
          methods (API keys, OAuth, etc.)
        </li>
        <li>
          <strong>Data extraction</strong>: Build robust data fetching with
          pagination and error handling
        </li>
        <li>
          <strong>Schema definitions</strong>: Define clear schemas for all data
          types
        </li>
        <li>
          <strong>Rate limiting</strong>: Respect API limits and implement
          backoff strategies
        </li>
        <li>
          <strong>Testing</strong>: Write comprehensive unit and integration
          tests
        </li>
      </ul>

      <h2>6. Document your connector</h2>
      <p>Include comprehensive documentation:</p>
      <ul>
        <li>Getting started guide</li>
        <li>Configuration options</li>
        <li>Schema documentation</li>
        <li>Known limitations</li>
        <li>Example usage</li>
      </ul>

      <h2>7. Test thoroughly</h2>
      <pre>
        <code>{`# Run unit tests
pnpm test

# Run integration tests
pnpm test:integration

# Validate schemas
pnpm validate:schemas`}</code>
      </pre>

      <h2>8. Share your connector</h2>
      <p>
        Open a pull request to the{" "}
        <a href="https://github.com/514-labs/factory" target="_blank">
          factory repository
        </a>{" "}
        to share your connector with the community. Mention the connector{" "}
        <a href="https://github.com/514-labs/factory/issues" target="_blank">
          Issue
        </a>{" "}
        in the PR description.
      </p>

      <p>
        If you built your connector outside the factory monorepo, you'll need to
        add it to the monorepo's registry directory with all required metadata
        (defined in `connector-registry/_scaffold`).
      </p>

      <h2>Best practices</h2>
      <ul>
        <li>Follow the established directory structure</li>
        <li>Use TypeScript/Python type definitions</li>
        <li>Handle errors gracefully</li>
        <li>Log important operations</li>
        <li>Keep dependencies minimal</li>
        <li>Version your connector properly</li>
      </ul>
    </div>
  );
}
