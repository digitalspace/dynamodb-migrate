# Database Migrations

A simple DynamoDB database migration tool is included in the `/dynamodb-migrate` directory. This tool can be used to create and apply data migration scripts.

## Create new migration

`migration:create` command can be used to generate a blank migration script. `<migration-name>` is required.

```
npm run migration:create <migration-name>
```

## Apply migrations

`migration:up` command can be used to apply new migrations to the target database. The default `migration:up` command will target local DynamoDB on port 8000. The port can be overriden with the `DYNAMODB_ENDPOINT` env.

`migration:up:remote` can be used to target remote AWS databases. This will require the proper AWS credentials in the environments.

```bash
# Targeting dynamodb-local
npm run migration:up

# Targeting remote AWS DynamoDB
npm run migration:up:remote
```

## Alternative usage

The migration tool can be executed directly without the `npm run` command. The help command can be used to display the usage information.

```
node dynamodb-migrate/migrate.js help

Usage: migrate [options] [command]

Options:
  -V, --version   output the version number
  -r, --remote    Apply migration on remote target, requires AWS credentials in environment
  -h, --help      display help for command

Commands:
  create [name]   create a new migration
  up [migration]  apply all migrations or up to a certain migration
  help [command]  display help for command
```

# Configuration

You can configure the script by using environment variables. The following are the environment variables that the script is looking for:

- MIGRATIONS_DB_REGION
- MIGRATIONS_DB_ENDPOINT
- MIGRATIONS_TABLE_NAME
- MIGRATIONS_DIR
- MIGRATIONS_TEMPLATE
- DATE_FORMAT
