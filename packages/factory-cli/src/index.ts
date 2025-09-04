#!/usr/bin/env node
import { Command } from 'commander'
import pkg from '../package.json' assert { type: 'json' }
import { runScaffold } from './scaffold'

const program = new Command()
program
  .name('factory')
  .description('Connector & Pipeline Factory CLI')
  .version(pkg.version)

// Ensure parsing/validation errors cause non-zero exit codes when awaited
program.exitOverride()

program
  .command('scaffold')
  .description('Generate a new connector or pipeline from scaffold templates')
  .argument('<kind>', 'connector | pipeline')
  .argument('<language>', 'typescript | python | meta')
  .option('-n, --name <name>', 'connector/pipeline id (kebab-case)')
  .option('--scaffold-version <version>', 'version identifier (e.g. v1, v3, ga4)')
  .option('-a, --author <author>', 'author org/user (kebab-case)')
  .option('-i, --implementation <impl>', "implementation name under language (default: 'default')")
  .option('--package-name <pkg>', 'package name for lang impl (npm or python package)')
  .option('--resource <resource>', 'default resource path segment (kebab-case)')
  .option('--dry-run', 'print planned operations without writing files')
  .option('-y, --yes', 'skip prompts and use provided flags/defaults')
  .action(async (kind, language, opts) => {
    await runScaffold({ kind, language, options: opts })
  })

async function main() {
  await program.parseAsync(process.argv)
}

main().catch((error: any) => {
  console.error(error)
  const code = typeof error?.exitCode === 'number' ? error.exitCode : 1
  process.exit(code)
})

