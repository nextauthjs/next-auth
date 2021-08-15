---
id: typeorm-overview
title: Overview
---

## TypeORM Adapter

### Database Schemas

Configure your database by creating the tables and columns to match the schema expected by NextAuth.js.

- [MySQL Schema](./mysql)
- [Postgres Schema](./postgres)
- [Microsoft SQL Server Schema](./mssql)
- [MongoDB](./mongodb)

The tutorial [Custom models with TypeORM](/tutorials/typeorm-custom-models) explains how to extend the built in models and schemas used by the TypeORM Adapter. You can use these models in your own code.

:::tip
The `synchronize` option in TypeORM will generate SQL that exactly matches the documented schemas for MySQL and Postgres. This will automatically apply any changes it finds in the entity model, therefore it **should not be enabled against production databases** as it may cause data loss if the configured schema does not match the expected schema!
:::
