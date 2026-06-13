#!/usr/bin/env node

import { Command } from "commander";
import { createCommand } from "./commands/create.js";
import { addCommand } from "./commands/add.js";
import { removeCommand } from "./commands/remove.js";
import { updateCommand } from "./commands/update.js";
import { runCommand, handleCliError } from "./utils/exit.js";

const program = new Command();

program
  .name("genesis")
  .description("Genesis — modular project starter & component ecosystem")
  .version("0.1.0");

program
  .command("create")
  .description("Create a new Genesis project")
  .argument("[name]", "Project name")
  .option("-t, --template <template>", "Template name (custom, informational-site, saas-app, ecommerce)")
  .option("-s, --structure <structure>", "Project structure: monolith (default) or monorepo")
  .option("-m, --modules <modules>", "Comma-separated module list")
  .option("-y, --yes", "Use defaults without prompts")
  .option("-l, --local", "Link @genesis/* packages from the local monorepo (file: paths)")
  .action((name, options) => runCommand(() => createCommand(name, options)));

program
  .command("add")
  .description("Add a module to an existing project")
  .argument("<module>", "Module name (auth, payments, etc.)")
  .option("-l, --local", "Link @genesis/* packages from the local monorepo (file: paths)")
  .action((module, options) => runCommand(() => addCommand(module, options)));

program
  .command("remove")
  .description("Remove a module from a project")
  .argument("<module>", "Module name")
  .action((module) => runCommand(() => removeCommand(module)));

program
  .command("update")
  .description("Update Genesis modules to latest compatible versions")
  .action(() => runCommand(() => updateCommand()));

program.parseAsync().catch((error) => {
  handleCliError(error);
});
