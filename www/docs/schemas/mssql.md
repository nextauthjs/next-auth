---
id: mssql
title: Mssql (Sql Server)
---

Schema for a mssql (Sql Server) database.

:::note
When using a mssql database with the default adapter (TypeORM) all properties of type `timestamp` are transformed to `datetime`.

This transform is also applied to any properties of type `timestamp` when using custom models.
:::
##### schema guideline
```sql
CREATE TABLE [accounts](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[compound_id] [varchar](255) NOT NULL,
	[user_id] [int] NOT NULL,
	[provider_type] [varchar](255) NOT NULL,
	[provider_id] [varchar](255) NOT NULL,
	[provider_account_id] [varchar](255) NOT NULL,
	[refresh_token] [text] NULL,
	[access_token] [text] NULL,
	[access_token_expires] [datetime] NULL,
	[created_at] [datetime] NOT NULL DEFAULT getdate(),
	[updated_at] [datetime] NOT NULL DEFAULT getdate()
)
CREATE TABLE [sessions](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[expires] [datetime] NOT NULL,
	[session_token] [varchar](255) NOT NULL,
	[access_token] [varchar](255) NOT NULL,
	[created_at] [datetime] NOT NULL DEFAULT getdate(),
	[updated_at] [datetime] NOT NULL DEFAULT getdate()
)
CREATE TABLE [users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](255) NULL,
	[email] [varchar](255) NULL,
	[email_verified] [datetime] NULL,
	[image] [varchar](255) NULL,
	[created_at] [datetime] NOT NULL DEFAULT getdate(),
	[updated_at] [datetime] NOT NULL DEFAULT getdate()
) 
CREATE TABLE [verification_requests](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[identifier] [varchar](255) NOT NULL,
	[token] [varchar](255) NOT NULL,
	[expires] [datetime] NOT NULL,
	[created_at] [datetime] NOT NULL DEFAULT getdate(),
	[updated_at] [datetime] NOT NULL DEFAULT getdate()
)
```

:::note for the complete schema you are probably better off runing it once with `?syncronize=true` and exporting the TypeORM generated schema
:::