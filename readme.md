# Database Migrations

A simple DynamoDB database migration tool is included in the `/dynamodb-migrate` directory. This tool can be used to create and apply data migration scripts.

## package.json configuration

Add the following to scripts:

```
"migrate": "node ./node_modules/@digitalspace/dynamodb-migrate/migrate.js"
```

## Create new migration

`migration create` command can be used to generate a blank migration script. `<migration-name>` is required.

```
npm run migration create <migration-name>
```

## Apply migrations

`migration up` command can be used to apply new migrations to the target database. The default `migration up` command will target local DynamoDB on port 8000. The port can be overriden with the `DYNAMODB_ENDPOINT` env.

`migration up remote` can be used to target remote AWS databases. This will require the proper AWS credentials in the environments.

```bash
# Targeting dynamodb-local
npm run migration up

# Targeting remote AWS DynamoDB
npm run migration up remote
```

# Configuration

You can configure the script by using environment variables. The following are the environment variables that the script is looking for:

- MIGRATIONS_DB_REGION
- MIGRATIONS_DB_ENDPOINT
- MIGRATIONS_TABLE_NAME
- MIGRATIONS_DIR
- MIGRATIONS_TEMPLATE
- DATE_FORMAT
