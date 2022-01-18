"use strict";
const path = require("path");
const fs = require("fs");
const AWS = require("aws-sdk");

const DatabaseUtils = require("./databaseUtils");

exports.up = async function (config, name) {
  const dbUtils = new DatabaseUtils(config);
  await dbUtils.verifyMigrationsTableExistence();

  const documentClient = new AWS.DynamoDB.DocumentClient(dbUtils.dbOptions);
  const existingMigrations = await retrieveExistingMigrations(
    config,
    documentClient
  );

  const migrationsDir = path.join(__dirname, `../${config.MIGRATIONS_DIR}`);

  fs.readdir(migrationsDir, async function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    for (const file of files) {
      // Skip if migration is already applied
      if (existingMigrations.find((existing) => existing.sk === file)) {
        continue;
      }

      await apply(migrationsDir, file, dbUtils);
      await recordMigration(file, documentClient, config);

      // Skip rest of the migrations if a only applying up to a specific migration
      if (file.startsWith(name)) {
        break;
      }
    }

    console.log("Finished applying all migrations");
  });
};

async function retrieveExistingMigrations(config, documentClient) {
  try {
    const data = await documentClient
      .scan({ TableName: config.MIGRATIONS_TABLE_NAME })
      .promise();
    return data.Items;
  } catch (err) {
    console.error("Failed to retrieve existing migrations", err);
    return [];
  }
}

async function apply(migrationsDir, file, dbUtils) {
  try {
    const migration = require(path.join(migrationsDir, file));

    if (migration.up) {
      console.log(`Applying migration ${file}`);
      await migration.up(dbUtils.dbOptions);

      console.log(`Finished migration ${file}\n`);
    }
  } catch (err) {
    console.error(
      `Error applying migration ${file}, ending migration run`,
      err
    );
    throw err;
  }
}

async function recordMigration(file, documentClient, config) {
  try {
    const params = {
      TableName: config.MIGRATIONS_TABLE_NAME,
      Item: {
        pk: "migration",
        sk: file,
        run_on: new Date().toISOString(),
      },
    };

    await documentClient.put(params).promise();
  } catch (err) {
    console.error("Failed to record migration run", err);
  }
}
