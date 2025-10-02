/**
 * Connector Executor
 * Executes connector operations and fetches data
 */

export interface ResourceExecutionResult {
  raw: any[];
  normalized: any[];
}

export interface ResourceConfig {
  name: string;
  operation: string;
  sampleSize: number;
  params?: any;
}

/**
 * Execute a connector resource operation and collect results
 */
export async function executeResource(
  connectorInstance: any,
  captureResult: { raw: any[] },
  resource: ResourceConfig
): Promise<ResourceExecutionResult> {
  const records: any[] = [];

  // Clear previous raw captures
  captureResult.raw = [];

  // Parse operation (e.g., "brand.getAll" → ["brand", "getAll"])
  const [resourceName, methodName] = resource.operation.includes('.')
    ? resource.operation.split('.')
    : [null, resource.operation];

  if (!resourceName || !methodName) {
    throw new Error(`Invalid operation format: ${resource.operation}. Expected format: "resource.method"`);
  }

  // Get the resource object (e.g., instance.brand)
  const resourceObj = connectorInstance[resourceName];
  if (!resourceObj || typeof resourceObj[methodName] !== 'function') {
    throw new Error(`Operation not found: ${resource.operation}`);
  }

  // Execute the operation
  const result = await resourceObj[methodName](resource.params ?? {});

  // Handle async iterator (like getAll)
  if (result && typeof (result as any)[Symbol.asyncIterator] === 'function') {
    let count = 0;
    for await (const page of result as AsyncIterable<any>) {
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

