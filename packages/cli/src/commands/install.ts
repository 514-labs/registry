import { Command } from "commander";
import { createWriteStream, promises as fs } from "fs";
import os from "os";
import path from "path";
import { pipeline } from "stream/promises";
import unzipper from "unzipper";

const OWNER = "514-labs";
const REPO = "connector-factory";
const DEFAULT_BRANCH = "main";

export function installCommand() {
  const cmd = new Command("install")
    .description("Install a connector into the current project")
    .argument("<name>")
    .argument("<version>")
    .argument("<author>")
    .argument("<language>")
    .option("--branch <name>", "git branch", DEFAULT_BRANCH)
    .option("--dest <dir>", "destination directory (defaults to ./<name>)")
    .action((name, version, author, language, opts) => installConnector(name, version, author, language, opts));

  return cmd;
}

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function installConnector(
  name: string,
  version: string,
  author: string,
  language: string,
  opts: { branch?: string; dest?: string },
): Promise<void> {
  const rel = `registry/${name}/${version}/${author}/${language}`;
  const dest = path.resolve(process.cwd(), opts.dest ?? `./${name}`);
  if (await pathExists(dest)) {
    console.error(`❌ Destination already exists: ${dest}`);
    console.error(`👉 Please remove it or choose a different location.`);
    process.exit(1);
  }

  const zipUrl = `https://codeload.github.com/${OWNER}/${REPO}/zip/refs/heads/${opts.branch ?? DEFAULT_BRANCH}`;
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "cf-"));
  const zipPath = path.join(tmp, "repo.zip");

  await downloadToFile(zipUrl, zipPath);
  await extractZip(zipPath, tmp);

  const root = await findExtractRoot(tmp);
  const srcDir = path.join(tmp, root, rel);
  if (!(await pathExists(srcDir))) {
    console.error(`❌ Connector path not found: ${rel}`);
    process.exit(1);
  }

  await copyDir(srcDir, dest);
  console.log(`\n✅ Installed into ${dest}\n`);

  await printNextSteps(dest);
}

async function downloadToFile(url: string, filePath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok || !res.body) {
    throw new Error(`Failed to download (HTTP ${res.status})`);
  }
  await pipeline(res.body, createWriteStream(filePath));
}

async function extractZip(zipPath: string, destinationDir: string): Promise<void> {
  await fs.mkdir(destinationDir, { recursive: true });
  const directory = await unzipper.Open.file(zipPath as unknown as string);
  await directory.extract({ path: destinationDir, concurrency: 8 });
}

async function findExtractRoot(unzipDir: string): Promise<string> {
  const entries = await fs.readdir(unzipDir);
  const root = entries.find((e: string) => e.startsWith(`${REPO}-`));
  if (!root) {
    throw new Error("Unable to locate extracted repository directory");
  }
  return root;
}

async function copyDir(srcDir: string, destDir: string): Promise<void> {
  await fs.mkdir(destDir, { recursive: true });
  await fs.cp(srcDir, destDir, { recursive: true, filter: (p: string) => path.basename(p) !== ".git" });
}

async function printNextSteps(dest: string): Promise<void> {
  const gettingStarted = path.join(dest, "docs", "getting-started.md");
  const exampleTs = path.join(dest, "examples", "basic-usage.ts");
  const examplePy = path.join(dest, "examples", "basic-usage.py");

  console.log("🚀 Next steps:");

  if (await pathExists(gettingStarted)) console.log(`  - Open ${gettingStarted}`);
  if (await pathExists(exampleTs)) console.log(`  - Review ${exampleTs}`);
  if (await pathExists(examplePy)) console.log(`  - Review ${examplePy}`);
  console.log("");
}


