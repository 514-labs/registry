import { NextResponse } from "next/server";
import { readFile, readdir } from "fs/promises";
import { join } from "path";

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
  // Read params from the generated JSON file structure instead of importing from registry
  const params: Params[] = [];
  const apiConnectorsDir = join(process.cwd(), "public", "api", "connectors");

  const connectorDirs = await readdir(apiConnectorsDir, { withFileTypes: true });

  for (const connectorDir of connectorDirs) {
    if (!connectorDir.isDirectory()) continue;

    const connectorPath = join(apiConnectorsDir, connectorDir.name);
    const versionDirs = await readdir(connectorPath, { withFileTypes: true });

    for (const versionDir of versionDirs) {
      if (!versionDir.isDirectory()) continue;

      const versionPath = join(connectorPath, versionDir.name);
      const creatorDirs = await readdir(versionPath, { withFileTypes: true });

      for (const creatorDir of creatorDirs) {
        if (!creatorDir.isDirectory()) continue;

        const creatorPath = join(versionPath, creatorDir.name);
        const languageDirs = await readdir(creatorPath, { withFileTypes: true });

        for (const languageDir of languageDirs) {
          if (!languageDir.isDirectory()) continue;

          const languagePath = join(creatorPath, languageDir.name);
          const implFiles = await readdir(languagePath);

          for (const implFile of implFiles) {
            if (!implFile.endsWith('.json')) continue;

            params.push({
              id: connectorDir.name,
              version: versionDir.name,
              creator: creatorDir.name,
              language: languageDir.name,
              implementation: implFile.replace('.json', ''),
            });
          }
        }
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
