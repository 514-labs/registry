import { NextResponse } from "next/server";
import { readFile, readdir } from "fs/promises";
import { join } from "path";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = {
  id: string;
};

export async function generateStaticParams(): Promise<Params[]> {
  // Read connector IDs from the generated JSON files instead of importing from registry
  const apiConnectorsDir = join(process.cwd(), "public", "api", "connectors");
  const files = await readdir(apiConnectorsDir);
  const connectorIds = files
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
  return connectorIds.map((id) => ({ id }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;

  try {
    // Read the pre-generated JSON file
    const filePath = join(process.cwd(), "public", "api", "connectors", `${id}.json`);
    const fileContents = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContents);

    // Cache the response since the data is static and pre-generated
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error(`Failed to read connector ${id}:`, error);
    return NextResponse.json(
      { error: "Connector not found" },
      { status: 404 }
    );
  }
}
