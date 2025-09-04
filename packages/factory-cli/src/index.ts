#!/usr/bin/env node
import { Command } from 'commander'
import pkg from '../package.json' assert { type: 'json' }
import { runScaffold } from './scaffold'

const program = new Command()
program
  .name('registry')
  .description('514 Labs Registry CLI')
  .version(pkg.version)

// Show help after errors
program.showHelpAfterError()

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
  try {
    await program.parseAsync(process.argv)
  } catch (error: any) {
    // Handle Commander.js help display (not actually an error)
    if (error?.code === 'commander.helpDisplayed') {
      process.exit(error.exitCode || 0)
    }
    
    // Handle parsing errors gracefully
    if (error?.message) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    process.exit(1)
  }
}

main()

