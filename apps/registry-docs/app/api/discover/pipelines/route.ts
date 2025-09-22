import { buildDiscoverPipelines } from "@/lib/pipeline-discover";

export async function GET() {
  try {
    const pipelines = await buildDiscoverPipelines();
    return Response.json(pipelines);
  } catch (error) {
    console.error("Failed to build discover pipelines:", error);
    return Response.json([], { status: 500 });
  }
}