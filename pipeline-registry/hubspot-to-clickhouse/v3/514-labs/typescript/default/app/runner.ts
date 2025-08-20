export class PipelineRunner {
  constructor(public config: Record<string, unknown>) {}
  ping(): boolean { return true }
}
