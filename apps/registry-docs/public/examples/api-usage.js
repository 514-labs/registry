/**
 * Example usage of the Connector Factory Registry API
 * This script demonstrates how to interact with the public APIs
 */

const BASE_URL = "https://registry.docs.moose.dev/api";

// Example 1: Get all registry contents
async function getAllRegistryContents() {
  const response = await fetch(`${BASE_URL}/registry/contents`);
  const data = await response.json();

  console.log(`Total items: ${data.total}`);
  console.log(`Connectors: ${data.connectors}`);
  console.log(`Pipelines: ${data.pipelines}`);

  return data;
}

// Example 2: Get TypeScript connectors only
async function getTypeScriptConnectors() {
  const response = await fetch(
    `${BASE_URL}/registry/contents?type=connector&language=typescript`
  );
  const data = await response.json();

  console.log("TypeScript Connectors:");
  data.items.forEach((item) => {
    console.log(`- ${item.name} (${item.id}) by ${item.author}`);
  });

  return data;
}

// Example 3: Get connector scaffold template
async function getConnectorScaffold(language) {
  const response = await fetch(`${BASE_URL}/connectors/scaffolds/${language}`);
  const data = await response.json();

  console.log(`Connector scaffold template for ${language}:`);
  console.log(`Version: ${data.version}`);
  console.log(`Description: ${data.description}`);
  console.log("\nVariables:");
  Object.entries(data.variables).forEach(([key, value]) => {
    console.log(`- ${key}: ${value.description}`);
  });
  console.log("\nStructure:");
  printScaffoldTree(data.structure);

  return data;
}

// Example 4: Get pipeline scaffold template
async function getPipelineScaffold(language) {
  const response = await fetch(`${BASE_URL}/pipelines/scaffolds/${language}`);
  const data = await response.json();

  console.log(`Pipeline scaffold template for ${language}:`);
  console.log(`Version: ${data.version}`);
  console.log(`Description: ${data.description}`);
  console.log("\nVariables:");
  Object.entries(data.variables).forEach(([key, value]) => {
    console.log(`- ${key}: ${value.description}`);
  });
  console.log("\nStructure:");
  printScaffoldTree(data.structure);

  return data;
}

// Helper function to print scaffold tree
function printScaffoldTree(nodes, indent = "") {
  nodes.forEach((node) => {
    const icon = node.type === "dir" ? "📁" : "📄";
    console.log(`${indent}${icon} ${node.name}`);
    if (node.children) {
      printScaffoldTree(node.children, indent + "  ");
    }
  });
}

// Example usage
async function main() {
  try {
    // Get all contents
    await getAllRegistryContents();

    console.log("\n---\n");

    // Get TypeScript connectors
    await getTypeScriptConnectors();

    console.log("\n---\n");

    // Get TypeScript connector scaffold template
    await getConnectorScaffold("typescript");

    console.log("\n---\n");

    // Get TypeScript pipeline scaffold template
    await getPipelineScaffold("typescript");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run examples if this file is executed directly
if (typeof module !== "undefined" && module === require.main) {
  main();
}
