#!/usr/bin/env node
import { Command, InvalidArgumentError } from "commander";
import path from "node:path";
import fs from "node:fs";
import process from "node:process";
import { loadConfigFromFileOrEnv, type HarnessConfig } from "../config";
import { runConnectorOperation } from "../runner";

function parseInteger(value: string, prev: number | undefined): number {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 0) throw new InvalidArgumentError("Must be a non-negative integer");
  return parsed;
}

const program = new Command();
program
  .name("factory")
  .description("Connector Factory CLI - Local Connector Testing Harness")
  .version("0.1.0");

program
  .command("run-connector")
  .description("Run a connector operation locally for debugging")
  .argument("<connector>", "connector name (e.g., hubspot)")
  .requiredOption("--implementation <impl>", "implementation to use (e.g., typescript/data-api)")
  .requiredOption("--operation <name>", "operation to call (e.g., listContacts, streamDeals)")
  .option("--config <path>", "path to JSON config file")
  .option("--params <json>", "JSON string for operation params (e.g., '{\"limit\":5}')")
  .option("--limit <n>", "limit number of items for streaming operations", parseInteger)
  .option("--output <file>", "write JSONL output to a file instead of stdout")
  .option("--no-logs", "disable verbose request/response logs")
  .action(async (connectorName: string, opts: any) => {
    const { implementation, operation, config: configPath, params: paramsJson, limit, output, logs } = opts;

    const implParts = implementation.split("/");
    if (implParts.length < 1) throw new Error("--implementation must be like 'typescript/data-api' or 'typescript'");
    const language = implParts[0];

    const params = paramsJson ? JSON.parse(paramsJson) : undefined;

    const harnessConfig: HarnessConfig = await loadConfigFromFileOrEnv(configPath ?? null, {
      connector: connectorName,
      language,
      implementation,
      enableLogs: logs !== false,
    });

    const outputStream = output ? fs.createWriteStream(path.resolve(process.cwd(), output), { flags: "w" }) : process.stdout;

    const resultCode = await runConnectorOperation({
      connectorName,
      language,
      implementation,
      operationName: operation,
      params,
      limit: typeof limit === "number" ? limit : undefined,
      config: harnessConfig.connectorConfig,
      output: outputStream,
      enableLogs: harnessConfig.enableLogs,
    });
    if (output && outputStream !== process.stdout) outputStream.end();
    process.exit(resultCode);
  });

program.parseAsync(process.argv);

