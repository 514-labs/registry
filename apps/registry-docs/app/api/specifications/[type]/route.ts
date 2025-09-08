import { NextRequest, NextResponse } from "next/server";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-static";

// Available specification types
const SPEC_TYPES = ["common", "saas", "api", "blob", "database"];

type RouteParams = {
  type: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  const { type } = await params;

  // Validate spec type
  if (!SPEC_TYPES.includes(type)) {
    return NextResponse.json(
      {
        error: `Specification type '${type}' not found. Available types: ${SPEC_TYPES.join(", ")}`,
      },
      { status: 404 }
    );
  }

  // Build path to the specification file
  const specPath = join(
    process.cwd(),
    "content",
    "docs",
    "specifications",
    `${type}.mdx`
  );

  if (!existsSync(specPath)) {
    return NextResponse.json(
      {
        error: `Specification file for '${type}' not found`,
      },
      { status: 404 }
    );
  }

  try {
    // Read the MDX file
    let content = readFileSync(specPath, "utf-8");

    // Remove MDX frontmatter if present
    if (content.startsWith("---")) {
      const endOfFrontmatter = content.indexOf("---", 3);
      if (endOfFrontmatter !== -1) {
        content = content.substring(endOfFrontmatter + 4).trim();
      }
    }

    // Return the raw markdown content
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error(`Error reading specification file for ${type}:`, error);
    return NextResponse.json(
      { error: "Failed to read specification file" },
      { status: 500 }
    );
  }
}

// Generate static params for all spec types
export async function generateStaticParams() {
  return SPEC_TYPES.map((type) => ({ type }));
}
