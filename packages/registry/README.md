# Registry package

Utilities to enumerate and read the Connector and Pipeline registries in this monorepo.

## Connectors subpath

```ts
import {
  getConnectorsRegistryPath,
  listConnectorIds,
  readConnector,
  listConnectors,
} from "@workspace/registry/connectors";
```

## Pipelines subpath

```ts
import {
  getPipelinesRegistryPath,
  listPipelineIds,
  readPipeline,
  listPipelines,
} from "@workspace/registry/pipelines";
```