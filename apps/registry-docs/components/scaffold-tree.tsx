import React from "react";
import fs from "node:fs";
import path from "node:path";
import ScaffoldTreeView, { ScaffNode } from "./scaffold-tree-view";

function normalize(structure: any[]): ScaffNode[] {
  return structure.map((n) => ({
    type: n.type,
    name: n.name,
    children: n.children ? normalize(n.children) : undefined,
  }));
}

function findFirstDirByName(
  nodes: ScaffNode[],
  name: string
): ScaffNode | undefined {
  for (const n of nodes) {
    if (n.type === "dir" && n.name === name) return n;
    const child = n.children && findFirstDirByName(n.children, name);
    if (child) return child;
  }
  return undefined;
}

function extractLanguageView(
  structure: ScaffNode[],
  language: "python" | "typescript"
): ScaffNode[] {
  const lang = findFirstDirByName(structure, language);
  if (!lang) return [];
  const impl = (lang.children ?? []).find(
    (c) => c.type === "dir" && c.name === "{implementation}"
  );
  const languageRoot: ScaffNode = {
    type: "dir",
    name: lang.name,
    children: impl ? [impl] : (lang.children ?? []),
  };
  return [languageRoot];
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
  const pythonStructure = readScaffold(
    "../../connector-registry/_scaffold/python.json"
  );
  const typescriptStructure = readScaffold(
    "../../connector-registry/_scaffold/typescript.json"
  );

  const pythonView = extractLanguageView(pythonStructure, "python");
  const typescriptView = extractLanguageView(typescriptStructure, "typescript");

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mt-0">Python implementation scaffold</h3>
        <div className="rounded-md border bg-card p-3">
          {pythonView.length ? (
            <ScaffoldTreeView nodes={pythonView} />
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
          <ScaffoldTreeView nodes={typescriptView} />
        </div>
      </section>
    </div>
  );
}

export async function PipelineScaffoldTrees() {
  const pythonStructure = readScaffold(
    "../../pipeline-registry/_scaffold/python.json"
  );
  const typescriptStructure = readScaffold(
    "../../pipeline-registry/_scaffold/typescript.json"
  );

  const pythonView = extractLanguageView(pythonStructure, "python");
  const typescriptView = extractLanguageView(typescriptStructure, "typescript");

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mt-0">Python implementation scaffold</h3>
        <div className="rounded-md border bg-card p-3">
          {pythonView.length ? (
            <ScaffoldTreeView nodes={pythonView} />
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
          <ScaffoldTreeView nodes={typescriptView} />
        </div>
      </section>
    </div>
  );
}

export default ConnectorScaffoldTrees;
