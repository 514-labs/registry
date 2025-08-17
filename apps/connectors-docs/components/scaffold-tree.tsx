import React from "react";
import fs from "node:fs";
import path from "node:path";

type ScaffNode = {
  type: "dir" | "file";
  name: string;
  children?: ScaffNode[];
};

function renderTree(nodes: ScaffNode[]): React.ReactNode {
  return (
    <ul className="ml-4">
      {nodes.map((node, idx) => (
        <li key={idx} className="font-mono text-sm leading-6">
          <span className="select-text">
            {node.type === "dir" ? "📁 " : "📄 "}
            {node.name}
          </span>
          {node.children &&
            node.children.length > 0 &&
            renderTree(node.children)}
        </li>
      ))}
    </ul>
  );
}

function normalize(structure: any[]): ScaffNode[] {
  return structure.map((n) => ({
    type: n.type,
    name: n.name,
    children: n.children ? normalize(n.children) : undefined,
  }));
}

function readScaffold(relativePathFromApp: string): ScaffNode[] {
  try {
    const abs = path.resolve(process.cwd(), relativePathFromApp);
    const raw = fs.readFileSync(abs, "utf8");
    const json = JSON.parse(raw);
    return normalize(json.structure ?? []);
  } catch {
    return [];
  }
}

export async function ConnectorScaffoldTrees() {
  const metaStructure = readScaffold(
    "../../connector-registry/_scaffold/meta.json"
  );
  const pythonStructure = readScaffold(
    "../../connector-registry/_scaffold/python.json"
  );
  const typescriptStructure = readScaffold(
    "../../connector-registry/_scaffold/typescript.json"
  );

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mt-0">Meta scaffold</h3>
        <div className="rounded-md border bg-card p-3">
          {renderTree(metaStructure)}
        </div>
      </section>
      <section>
        <h3 className="mt-0">Python implementation scaffold</h3>
        <div className="rounded-md border bg-card p-3">
          {pythonStructure.length ? (
            renderTree(pythonStructure)
          ) : (
            <div className="text-sm text-muted-foreground">
              No Python scaffold found.
            </div>
          )}
        </div>
      </section>
      <section>
        <h3 className="mt-0">TypeScript implementation scaffold</h3>
        <div className="rounded-md border bg-card p-3">
          {renderTree(typescriptStructure)}
        </div>
      </section>
    </div>
  );
}

export default ConnectorScaffoldTrees;
