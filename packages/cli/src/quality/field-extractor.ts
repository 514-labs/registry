/**
 * Field Extractor
 * Extracts all field paths from records and prepares them for analysis
 */

/**
 * Flatten nested objects into dot-notation paths
 */
function flattenObject(obj: any, prefix = '', maxDepth = 5, currentDepth = 0): Record<string, any> {
  if (currentDepth >= maxDepth) {
    return { [prefix]: obj };
  }

  if (obj === null || obj === undefined) {
    return { [prefix]: obj };
  }

  // Handle arrays - keep as-is
  if (Array.isArray(obj)) {
    return { [prefix]: obj };
  }

  // Handle objects
  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      const flattened = flattenObject(value, newPrefix, maxDepth, currentDepth + 1);
      Object.assign(result, flattened);
    }

    return result;
  }

  // Primitive value
  return { [prefix]: obj };
}

export interface FieldData {
  fieldPath: string;
  values: any[];
}

/**
 * Extract all field paths and their values from records
 */
export function extractFields(records: any[]): FieldData[] {
  if (records.length === 0) {
    return [];
  }

  // First pass: collect all possible field paths across all records
  const allFieldPaths = new Set<string>();
  const flattenedRecords: Array<Record<string, any>> = [];

  for (const record of records) {
    const flattened = flattenObject(record);
    flattenedRecords.push(flattened);

    for (const path of Object.keys(flattened)) {
      // Skip internal fields (like _length, _isEmpty)
      if (!path.includes('._')) {
        allFieldPaths.add(path);
      }
    }
  }

  // Second pass: collect values for each field
  const fieldDataList: FieldData[] = [];

  for (const fieldPath of Array.from(allFieldPaths).sort()) {
    const values: any[] = [];

    for (const flattened of flattenedRecords) {
      const value = flattened[fieldPath];
      values.push(value);
    }

    fieldDataList.push({ fieldPath, values });
  }

  return fieldDataList;
}

