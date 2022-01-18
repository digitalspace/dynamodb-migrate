"use strict";

const { Command } = require("commander");

const { create } = require("./create");
const { up } = require("./up");

const program = new Command();

const CONFIG = {
  MIGRATIONS_DB_REGION: process.env.MIGRATIONS_DB_REGION || "ca-central-1",
  MIGRATIONS_DB_ENDPOINT:
    process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
  MIGRATIONS_TABLE_NAME: process.env.MIGRATIONS_TABLE_NAME || "migrations",
  MIGRATIONS_DIR: process.env.MIGRATIONS_DIR || "migrations",
  MIGRATIONS_TEMPLATE: process.env.MIGRATIONS_TEMPLATE || "migration.template",
};

program
  .version("0.0.1")
  .option(
    "-r, --remote",
    "Apply migration on remote target, requires AWS credentials in environment"
  );

program
  .command("create")
  .argument("[name]", "name of the migration to create")
  .description("create a new migration")
  .action((name) => {
    create(CONFIG, name);
  })
  .addHelpText(
    "after",
    `
  Examples:
    node migrate.js create helloworld`
  );

program
  .command("up")
  .argument(
    "[migration]",
    "migration to apply, all preceding migrations will also be applied"
  )
  .description("apply all migrations or up to a certain migration")
  .action((migration) => {
    CONFIG.REMOTE = program.opts().remote;
    up(CONFIG, migration);
  })
  .addHelpText(
    "after",
    `
  Examples:
    node migrate.js up
    ndoe migrate.js up 20211108120000-helloworld.js`
  );

program.parse();
