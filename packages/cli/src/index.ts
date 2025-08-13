#!/usr/bin/env node

import { Command } from "commander";
import { installCommand } from "./commands/install.js";
import { listCommand } from "./commands/list.js";

const program = new Command()
  .name("connector-factory")
  .description("Connector Factory CLI")
  .version("0.0.0", "-v, --cli-version");

program.addCommand(listCommand());
program.addCommand(installCommand());

program.parseAsync();
