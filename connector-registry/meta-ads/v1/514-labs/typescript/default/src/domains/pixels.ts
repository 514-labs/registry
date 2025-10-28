import type { Pixel } from "../types/connector";
import { createGlobalDomainFactory, type SendFn } from "./factory";

export function buildPixelsDomain(sendFn: SendFn) {
  const factory = createGlobalDomainFactory<Pixel>("/me/adspixels", sendFn);

  return {
    list: factory.list,
    stream: factory.stream,
    getAll: factory.getAll,
  };
}