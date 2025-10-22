import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { readConnector, listConnectorIds } from "@workspace/registry/connectors";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = {
  id: string;
  version: string;
  creator: string;
  language: string;
  implementation: string;
};

export async function generateStaticParams(): Promise<Params[]> {
  const params: Params[] = [];
  for (const id of listConnectorIds()) {
    const conn = readConnector(id);
    if (!conn) continue;
    for (const provider of conn.providers) {
      const version = provider.path.split("/").slice(-2)[0];
      for (const impl of provider.implementations) {
        params.push({
          id,
          version,
          creator: provider.authorId,
          language: impl.language,
          implementation: impl.implementation ?? "default",
        });
      }
    }
  }
  return params;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id, version, creator, language, implementation } = await params;

  try {
    // Read the pre-generated JSON file
    const filePath = join(
      process.cwd(),
      "public",
      "api",
      "connectors",
      id,
      version,
      creator,
      language,
      `${implementation}.json`
    );
    const fileContents = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContents);

    // Cache the response since the data is static and pre-generated
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error(`Failed to read connector implementation ${id}/${version}/${creator}/${language}/${implementation}:`, error);
    return NextResponse.json(
      { error: "Implementation not found" },
      { status: 404 }
    );
  }
}
