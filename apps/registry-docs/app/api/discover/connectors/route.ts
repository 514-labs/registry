import { buildDiscoverConnectors } from "@/lib/connector-discover";

export async function GET() {
  try {
    const connectors = await buildDiscoverConnectors();
    return Response.json(connectors);
  } catch (error) {
    console.error("Failed to build discover connectors:", error);
    return Response.json([], { status: 500 });
  }
}