import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

// This endpoint now serves pre-generated static data to avoid bundling
// the entire connector/pipeline registry into the serverless function.
// The data is generated at build time by scripts/generate-registry-data.mjs

export async function GET() {
  try {
    // Read the pre-generated JSON file
    const filePath = join(process.cwd(), "public", "registry-contents.json");
    const fileContents = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContents);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to read registry contents:", error);
    return NextResponse.json(
      { error: "Failed to load registry contents" },
      { status: 500 }
    );
  }
}
