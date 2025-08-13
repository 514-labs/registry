import { Command } from "commander";

const DEFAULT_REGISTRY_JSON_URL = process.env.REGISTRY_JSON_URL ?? "https://connectors.514.ai/registry.json";

type RegistryConnector = {
  name: string;
  version: string;
  author: string;
  languages?: string[];
};

type ListOptions = {
  registryUrl: string;
  name?: string[];
  version?: string[];
  author?: string[];
  language?: string[];
};

export function listCommand() {
  const parseCsv = (value: string): string[] =>
    value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const cmd = new Command("list")
    .description("List available connectors")
    .option("--name <n1,n2>", "filter by name(s)", parseCsv)
    .option("--version <v1,v2>", "filter by version(s)", parseCsv)
    .option("--author <a1,a2>", "filter by author(s)", parseCsv)
    .option("--language <l1,l2>", "filter by language(s)", parseCsv)
    .option("--registry-url <url>", "registry endpoint", DEFAULT_REGISTRY_JSON_URL)
    .action((opts: ListOptions) => listAction(opts));

  return cmd;
}

async function listAction(opts: ListOptions): Promise<void> {
  try {
    // Fetch registry.json
    const res = await fetch(opts.registryUrl, { redirect: "follow" });

    if (!res.ok) {
      throw new Error(`Registry unavailable (HTTP ${res.status})`);
    }

    const ct = (res.headers.get("content-type") ?? "").toLowerCase();
    if (!ct.includes("application/json")) {
      throw new Error(
        `Registry returned non-JSON (Content-Type: ${ct || "unknown"})`
      );
    }

    const body = (await res.json()) as {
      connectors?: RegistryConnector[];
    };
    const connectors = body.connectors ?? [];
    // Expand each connector’s languages into individual rows
    const items = connectors.flatMap((c) =>
      (c.languages ?? []).map((l) => ({ ...c, language: l }))
    );

    // Case-insensitive substring match helper; if no filter values provided, always pass
    const pass = (val: string, arr?: string[]) =>
      !arr ||
      arr.length === 0 ||
      arr.some((t) => val.toLowerCase().includes(t.trim().toLowerCase()));

    // Filter and format as copy-ready strings
    const lines = items
      .filter(
        (c) =>
          pass(c.name, opts.name) &&
          pass(c.version, opts.version) &&
          pass(c.author, opts.author) &&
          pass(c.language, opts.language)
      )
      .map((c) => `${c.name} ${c.version} ${c.author} ${c.language}`);

    if (lines.length === 0) {
      printCta();
      return;
    }

    console.log("✅ Install a connector with this command:\n")
    console.log("@connector-factory/cli install <name> <version> <author> <language>\n")
    console.log("--------------------------------\n")
    console.log("✅ Available connectors:\n")
    console.log(lines.join("\n") + "\n");
  } catch (e) {
    console.error(`❌ Error listing connectors: ${e}`);
    printCta();
  }
}

function printCta() {
  console.log("\n❌ No connectors found\n");
  console.log(
    "❤️  We would love your contributions: https://github.com/514-labs/connector-factory\n"
  );
}
