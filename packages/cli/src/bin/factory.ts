#!/usr/bin/env node
import { Command, InvalidArgumentError } from "commander";
import path from "node:path";
import fs from "node:fs";
import process from "node:process";
import { loadConfigFromFileOrEnv, type HarnessConfig } from "../config";
import { runConnectorOperation } from "../runner";
import { checkQuality } from "../commands/check-quality";

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
    try {
      const { implementation, operation, config: configPath, params: paramsJson, limit, output, logs } = opts;

      const implParts = implementation.split("/");
      if (!implParts[0]) {
        console.error("Error: --implementation must be like 'typescript/data-api' or 'typescript'");
        process.exit(1);
      }
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
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

program
  .command("check-quality")
  .description("Run quality checks on a connector using quality-check.yaml")
  .argument("<connector>", "connector name (e.g., dutchie)")
  .requiredOption("-v, --connector-version <version>", "version identifier (e.g., v001)")
  .requiredOption("-a, --author <author>", "author org/user (e.g., 514-labs)")
  .requiredOption("-l, --language <language>", "language (e.g., typescript, python)")
  .requiredOption("-i, --implementation <impl>", "implementation name (e.g., open-api, data-api)")
  .option("--config <path>", "path to JSON config file for auth")
  .option("--verbose", "show detailed field statistics")
  .action(async (connectorName: string, opts: any) => {
    try {
      const { connectorVersion, author, language, implementation, config: configPath, verbose } = opts;

      // Resolve connector directory
      const connectorDir = path.resolve(
        process.cwd(),
        `connector-registry/${connectorName}/${connectorVersion}/${author}/${language}/${implementation}`
      );

      const resultCode = await checkQuality({
        connector: connectorName,
        language,
        implementation,
        connectorDir,
        configPath: configPath ?? null,
        verbose: verbose ?? false,
      });

      process.exit(resultCode);
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

program.parseAsync(process.argv).catch((error) => {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});

