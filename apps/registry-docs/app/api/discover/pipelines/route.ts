import { readFile } from "fs/promises";
import { join } from "path";

export const dynamic = "force-static";

export async function GET() {
  try {
    // Read the pre-generated JSON file
    const filePath = join(process.cwd(), "public", "api", "discover", "pipelines.json");
    const fileContents = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContents);

    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error("Failed to read discover pipelines:", error);
    return Response.json([], { status: 500 });
  }
}