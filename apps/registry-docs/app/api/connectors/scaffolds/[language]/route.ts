import { NextRequest, NextResponse } from "next/server";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { getConnectorsRegistryPath } from "@workspace/registry/connectors";

// Helper function to extract the structure from the {implementation} node level down
function extractImplementationStructure(
  structure: any[],
  language: string
): any[] | null {
  // Navigate through the structure to find the {implementation} node
  // Structure: {connector} -> {version} -> {author} -> {language} -> {implementation}

  for (const connectorNode of structure) {
    if (connectorNode.type === "dir" && connectorNode.name === "{connector}") {
      for (const versionNode of connectorNode.children || []) {
        if (versionNode.type === "dir" && versionNode.name === "{version}") {
          for (const authorNode of versionNode.children || []) {
            if (authorNode.type === "dir" && authorNode.name === "{author}") {
              for (const languageNode of authorNode.children || []) {
                if (
                  languageNode.type === "dir" &&
                  languageNode.name === language
                ) {
                  for (const implementationNode of languageNode.children ||
                    []) {
                    if (
                      implementationNode.type === "dir" &&
                      implementationNode.name === "{implementation}"
                    ) {
                      return implementationNode.children || [];
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return null;
}

export const dynamic = "force-static";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ language: string }> }
) {
  const { language } = await params;

  // Validate language
  if (!["typescript", "python"].includes(language)) {
    return NextResponse.json(
      {
        error: `Language '${language}' not supported. Supported languages: typescript, python`,
      },
      { status: 400 }
    );
  }

  // Get the scaffold file path
  const registryPath = getConnectorsRegistryPath();
  const scaffoldPath = join(registryPath, "_scaffold", `${language}.json`);

  if (!existsSync(scaffoldPath)) {
    return NextResponse.json(
      { error: `Scaffold for language '${language}' not found` },
      { status: 404 }
    );
  }

  try {
    // Read and parse the scaffold file
    const scaffoldContent = readFileSync(scaffoldPath, "utf-8");
    const scaffold = JSON.parse(scaffoldContent);

    // Extract the structure from the {implementation} node level down
    const implementationStructure = extractImplementationStructure(
      scaffold.structure,
      language
    );

    if (!implementationStructure) {
      return NextResponse.json(
        {
          error: `Implementation structure not found for language '${language}'`,
        },
        { status: 500 }
      );
    }

    // Return scaffold with the implementation-level structure
    const response = {
      ...scaffold,
      structure: implementationStructure,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(`Error reading scaffold for ${language}:`, error);
    return NextResponse.json(
      { error: "Failed to read scaffold file" },
      { status: 500 }
    );
  }
}

// Generate static params for supported languages
export async function generateStaticParams() {
  return [{ language: "typescript" }, { language: "python" }];
}
