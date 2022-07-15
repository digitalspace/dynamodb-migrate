"use strict";

const AWS = require("aws-sdk");

class DatabaseUtils {
  constructor(config) {
    this.config = config;

    console.log("Using configuration:", config);

    this.dbOptions = { region: config.MIGRATIONS_DB_REGION };

    if (!config.REMOTE) {
      this.dbOptions.endpoint = config.MIGRATIONS_DB_ENDPOINT;
    }

    console.log("Seeting up DB:", this.dbOptions);

    this.db = new AWS.DynamoDB(this.dbOptions);
  }

  async verifyMigrationsTableExistence() {
    try {
      console.log("verifyMigrationsTableExistence");
      const data = await this.describeTable();
    } catch (err) {
      console.error(err);
      // Table doesn't exist, create it
      if (err.code === "ResourceNotFoundException") {
        await this.createMigrationsTable();

        // Wait for table to be active
        for (let i = 0; i < 10; i++) {
          const data = await this.describeTable();
          if (data.Table.TableStatus !== "ACTIVE") {
            await new Promise((r) => setTimeout(r, 2000));
          } else {
            break;
          }
        }
      } else {
        console.log("Failed to verify table status", err);
        throw err;
      }
    }
  }

  async describeTable() {
    console.log("Getting ", this.config.MIGRATIONS_TABLE_NAME)
    return this.db
      .describeTable({ TableName: this.config.MIGRATIONS_TABLE_NAME })
      .promise();
  }

  async createMigrationsTable() {
    try {
      const params = {
        AttributeDefinitions: [
          {
            AttributeName: "pk",
            AttributeType: "S",
          },
          {
            AttributeName: "sk",
            AttributeType: "S",
          },
        ],
        KeySchema: [
          {
            AttributeName: "pk",
            KeyType: "HASH",
          },
          {
            AttributeName: "sk",
            KeyType: "RANGE",
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
        TableName: this.config.MIGRATIONS_TABLE_NAME,
      };

      await this.db.createTable(params).promise();
    } catch (err) {
      console.log("Failed to create table", err);
    }
  }
}

module.exports = DatabaseUtils;
