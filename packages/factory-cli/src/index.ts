#!/usr/bin/env node
import { Command } from 'commander'
import pkg from '../package.json' assert { type: 'json' }
import { runScaffold } from './scaffold'

const program = new Command()
program
  .name('registry')
  .description('514 Labs Registry CLI')
  .version(pkg.version)

// Override Commander.js default process.exit behavior to allow try-catch handling
program.exitOverride()

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
    // Handle Commander.js specific errors that should exit with code 0
    if (error?.code === 'commander.helpDisplayed' || error?.code === 'commander.help' || error?.code === 'commander.version') {
      process.exit(error.exitCode || 0)
    }
    
    // Handle Commander.js parsing errors (invalid arguments, unknown options, etc.)
    if (error?.code && error.code.startsWith('commander.')) {
      if (error?.message) {
        console.error(error.message)
      }
      process.exit(error.exitCode || 1)
    }
    
    // Handle other unexpected errors
    if (error?.message) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    process.exit(1)
  }
}

main()

