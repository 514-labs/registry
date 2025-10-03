/**
 * Connector Executor
 * Executes connector operations and fetches data
 */

/**
 * Raw and normalized records from a connector operation
 */
export interface ResourceExecutionResult {
  raw: unknown[];
  normalized: unknown[];
}

export interface ResourceConfig {
  name: string;
  operation: string;
  sampleSize: number;
  params?: Record<string, unknown>;
}

/**
 * Execute a connector resource operation and collect results
 */
export async function executeResource(
  connectorInstance: unknown,
  captureResult: { raw: unknown[] },
  resource: ResourceConfig
): Promise<ResourceExecutionResult> {
  const records: unknown[] = [];

  // Clear previous raw captures
  captureResult.raw = [];

  // Parse operation (e.g., "brand.getAll" → ["brand", "getAll"])
  const [resourceName, methodName] = resource.operation.includes('.')
    ? resource.operation.split('.')
    : [null, resource.operation];

  if (!resourceName || !methodName) {
    throw new Error(`Invalid operation format: ${resource.operation}. Expected format: "resource.method"`);
  }

  // Type guard to safely access connector properties
  if (!isConnectorInstance(connectorInstance)) {
    throw new Error('Invalid connector instance');
  }

  // Get the resource object (e.g., instance.brand)
  const resourceObj = connectorInstance[resourceName];
  if (!resourceObj || typeof resourceObj !== 'object' || resourceObj === null) {
    throw new Error(`Resource not found: ${resourceName}`);
  }

  const method = (resourceObj as Record<string, unknown>)[methodName];
  if (typeof method !== 'function') {
    throw new Error(`Operation not found: ${resource.operation}`);
  }

  // Execute the operation
  const result = await method(resource.params ?? {});

  // Handle async iterator (like getAll)
  if (isAsyncIterable(result)) {
    let count = 0;
    for await (const page of result) {
      if (Array.isArray(page)) {
        for (const item of page) {
          records.push(item);
          count++;
          if (count >= resource.sampleSize) break;
        }
      } else {
        records.push(page);
        count++;
      }
      if (count >= resource.sampleSize) break;
    }
  } else {
    // Single result
    records.push(result);
  }

  return {
    raw: captureResult.raw.slice(0, resource.sampleSize),
    normalized: records,
  };
}

/**
 * Type guard to check if value is a connector instance
 */
function isConnectorInstance(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Type guard to check if value is async iterable
 */
function isAsyncIterable(value: unknown): value is AsyncIterable<unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    Symbol.asyncIterator in value &&
    typeof (value as any)[Symbol.asyncIterator] === 'function'
  );
}
