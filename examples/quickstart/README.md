# Quickstart Example

This example demonstrates a minimal end-to-end pipeline using Factory structures. It extracts sample data from the public JSONPlaceholder API and writes it to local files, showcasing hooks, logging, and error handling.

## Prerequisites
- Node 20+
- pnpm

## Install
From the repo root:

```bash
pnpm install
```

## Run
```bash
pnpm -C examples/quickstart start
```
This will:
- Initialize the connector
- Fetch a small set of posts
- Write files under `examples/quickstart/data/`
- Log request/response events via the logging hook

## Test mode
```bash
pnpm -C examples/quickstart test
```
Fetches fewer rows and exits.

## Customize
- Change the stream in `pipeline.json` from `posts` to `users` (connector would need a corresponding method)
- Modify the projection in `src/run.ts`
- Update logging in `src/hooks/logging.ts`

## Environment
Copy `.env.example` to `.env` if you need to set `LOG_LEVEL` or any API keys for real connectors.