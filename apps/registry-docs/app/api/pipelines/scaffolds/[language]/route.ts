import { NextRequest, NextResponse } from "next/server";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { getPipelinesRegistryPath } from "@workspace/registry/pipelines";

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
  const registryPath = getPipelinesRegistryPath();
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

    return NextResponse.json(scaffold);
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
