import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-static";

export async function GET() {
  try {
    const openApiPath = join(process.cwd(), "public", "openapi.yaml");
    const openApiContent = readFileSync(openApiPath, "utf-8");

    return new NextResponse(openApiContent, {
      status: 200,
      headers: {
        "Content-Type": "application/x-yaml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "OpenAPI specification not found" },
      { status: 404 }
    );
  }
}
