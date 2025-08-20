export class BaseLoader<T = unknown> {
  async load(records: T[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
