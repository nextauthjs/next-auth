        documentMode: "string",
        skipTypename: true,
        enumsAsTypes: true,
        useTypeImports: true,
        scalars: {
          timestamptz: "string",
++ b/packages/adapter-hasura/test/index.test.ts
import { runBasicTests } from "utils/adapter"
import { HasuraAdapter, format } from "../src"
import { useFragment } from "../src/lib/generated"
import type {
  AccountFragmentDoc,
  DeleteAllDocument,
  GetAccountDocument,
  SessionFragmentDoc,
  UserFragmentDoc,
  VerificationTokenFragmentDoc,
} from "../src/lib/generated/graphql.js"
import { client as hasuraClient } from "../src/lib/client"

const client = hasuraClient({
++ b/packages/adapter-hasura/src/index.ts
  client as hasuraClient,
  type HasuraAdapterClient,
} from "./lib/client.js"
import { useFragment } from "./lib/generated/index.js" // eslint-disable-next-line n/consistent-type-specifier
import {
  AccountFragmentDoc,
  CreateAccountDocument,
  UpdateSessionDocument,
  UpdateUserDocument,
  UserFragmentDoc,
  VerificationTokenFragmentDoc, // eslint-disable-next-line n/consistent-type-specifier
} from "./lib/generated/graphql.js"

export function HasuraAdapter(client: HasuraAdapterClient): Adapter {
++ b/packages/adapter-pg/test/index.test.ts
import { runBasicTests } from "utils/adapter"
import PostgresAdapter, { mapExpiresAt } from "../src"
import type { Pool } from "pg"

const POOL_SIZE = 20

++ b/packages/adapter-pg/src/index.ts
  AdapterUser,
  VerificationToken,
  AdapterSession,
} from "@auth/core/adapters" // eslint-disable-line n/consistent-type-specifier
import type { Pool } from "pg"

export function mapExpiresAt(account: any): any {
++ b/packages/adapter-upstash-redis/test/index.test.ts
import type { Redis } from "@upstash/redis"
import { runBasicTests } from "utils/adapter"
import { hydrateDates, UpstashRedisAdapter } from "../src/index.js"
import "dotenv/config"

const client = new Redis({
++ b/packages/adapter-upstash-redis/src/index.ts
  type AdapterAccount,
  type AdapterSession,
  type VerificationToken,
} from "@auth/core/adapters" // eslint-disable-line n/consistent-type-specifier
} from "@auth/core/adapters"
import type { Redis } from "@upstash/redis"

++ b/packages/adapter-d1/test/index.test.ts
import { beforeAll } from "vitest"

import { D1Adapter, up, getRecord } from "../src/index.js"
import {
  GET_USER_BY_ID_SQL,
  GET_SESSION_BY_TOKEN_SQL,
  GET_ACCOUNT_BY_PROVIDER_AND_PROVIDER_ACCOUNT_ID_SQL,
  GET_VERIFICATION_TOKEN_BY_IDENTIFIER_AND_TOKEN_SQL,
} from "../src/queries.js"
import type { AdapterAccount, AdapterSession, AdapterUser } from "@auth/core/adapters" // eslint-disable-line n/consistent-type-specifier
import { D1Database, D1DatabaseAPI } from "@miniflare/d1"
import { runBasicTests } from "utils/adapter"
import Database from "better-sqlite3"
++ b/packages/adapter-d1/src/queries.ts
export const CREATE_USER_SQL = `INSERT INTO users (id, name, email, emailVerified, image) VALUES (?, ?, ?, ?, ?)`
export const GET_USER_BY_ID_SQL = `SELECT * FROM users WHERE id = ?`
export const GET_USER_BY_EMAIL_SQL = `SELECT * FROM users WHERE email = ?`
export const GET_USER_BY_ACCOUNT_SQL = `
  SELECT u.*
  FROM users u JOIN accounts a ON a.userId = u.id
  WHERE a.providerAccountId = ? AND a.provider = ?`
++ b/packages/adapter-d1/src/migrations.ts
import type { D1Database } from "./index.js" // eslint-disable-line n/consistent-type-specifier

export const upSQLStatements = [
  `CREATE TABLE IF NOT EXISTS "accounts" (
++ b/packages/adapter-mongodb/test/index.test.ts
import { runBasicTests } from "utils/adapter"
import { defaultCollections, format, MongoDBAdapter, _id } from "../src"
import type { MongoClient } from "mongodb"

const name = "test"
const client = new MongoClient(`mongodb://localhost:27017/${name}`)
++ b/packages/adapter-mongodb/test/custom.test.ts
import { runBasicTests } from "utils/adapter"
import { defaultCollections, format, MongoDBAdapter, _id } from "../src"
import type { MongoClient } from "mongodb"
const name = "custom-test"
const client = new MongoClient(`mongodb://localhost:27017/${name}`)

++ b/packages/adapter-mongodb/test/serverless.test.ts
import { runBasicTests } from "utils/adapter"
import { defaultCollections, format, MongoDBAdapter, _id } from "../src"
import type { MongoClient } from "mongodb"
import { expect, test, vi } from "vitest"

const name = "serverless-test"
++ b/packages/adapter-supabase/test/index.test.ts
import { runBasicTests } from "utils/adapter"
import { format, SupabaseAdapter } from "../src"
import { createClient } from "@supabase/supabase-js" // eslint-disable-line n/consistent-type-specifier
import type { // eslint-disable-line n/consistent-type-specifier
  AdapterSession,
  AdapterUser,
  VerificationToken,
++ b/packages/adapter-fauna/test/index.test.ts
import { runBasicTests } from "utils/adapter"
import { Client, fql, NullDocument } from "fauna"

import type { // eslint-disable-line n/consistent-type-specifier
  FaunaUser,
  FaunaAccount,
  FaunaSession,
++ b/packages/adapter-fauna/src/index.ts
  AdapterUser,
  AdapterSession,
  VerificationToken,
} from "@auth/core/adapters" // eslint-disable-line n/consistent-type-specifier
} from "@auth/core/adapters"

type ToFauna<T> = {
++ b/packages/adapter-surrealdb/test/index.test.ts
import { runBasicTests } from "utils/adapter"
import type { Surreal } from "surrealdb" // eslint-disable-line n/consistent-type-specifier

import { config } from "./common"

++ b/packages/adapter-surrealdb/test/common.ts
import { RecordId } from "surrealdb"
import type { Surreal } from "surrealdb" // eslint-disable-line n/consistent-type-specifier

import {
  SurrealDBAdapter,
  docToUser,
  docToSession,
  docToVerificationToken,
  docToAuthenticator,
  SessionDoc,
  VerificationTokenDoc,
  AuthenticatorDoc,
} from "../src/index.js"

export const config = (clientPromise: Promise<Surreal>) => ({
  adapter: SurrealDBAdapter(clientPromise),
        user: userId,
      })
      const user = users.at(0)
      if (user) return docToUser(user as UserDoc)
      return null
    },
    async account({ provider, providerAccountId }) {
        { provider, providerAccountId }
      )
      const account = accounts.at(0)
      if (account) return docToAccount(account as AccountDoc)
      return null
    },
    async session(sessionToken: string) {
        { sessionToken }
      )
      const session = sessions.at(0)
      if (session) return docToSession(session as SessionDoc)
      return null
    },
    async verificationToken({ identifier, token }) {
++ b/packages/adapter-sequelize/test/index.test.ts
import { beforeEach, describe, expect, test } from "vitest"
import { DataTypes, Sequelize } from "sequelize" // eslint-disable-line n/consistent-type-specifier
import { runBasicTests } from "utils/adapter" // eslint-disable-line n/consistent-type-specifier
import SequelizeAdapter, { models } from "../src"

const sequelize = new Sequelize({
++ b/packages/adapter-sequelize/src/index.ts
  AdapterUser,
  AdapterAccount,
  AdapterSession,
} from "@auth/core/adapters" // eslint-disable-line n/consistent-type-specifier
} from "@auth/core/adapters"
import { Sequelize, Model, ModelCtor } from "sequelize"
import * as defaultModels from "./models.js"
++ b/packages/adapter-sequelize/src/models.ts
import { DataTypes } from "sequelize" // eslint-disable-line n/consistent-type-specifier

export const Account = {
  id: {
++ b/packages/utils/vitest.config.ts
/// <reference types="vitest" />

import { defineConfig } from "vite"
import swc from "unplugin-swc" // eslint-disable-line n/consistent-type-specifier
import preact from "@preact/preset-vite"

// https://vitejs.dev/config/
++ b/packages/utils/scripts/providers.js
// Use this script to re-export all providers from core in Auth.js frameworks

import fs from "fs/promises"
import { join, resolve } from "path"
import { parseArgs } from "node:util"

const sourceDir = resolve(process.cwd(), "../core/src/providers")
++ b/packages/utils/scripts/setup-fw-integration.js
import { promises as fs } from "fs"
import path from "path" // eslint-disable-line n/consistent-type-specifier

const __dirname = path.dirname(new URL(import.meta.url).pathname)

++ b/packages/adapter-dgraph/test/index.test.ts
import { DgraphAdapter, format } from "../src"
import { client as dgraphClient } from "../src/lib/client"
import * as fragments from "../src/lib/graphql/fragments"
import { runBasicTests } from "utils/adapter" // eslint-disable-line n/consistent-type-specifier
import fs from "fs" // eslint-disable-line n/consistent-type-specifier
import path from "path" // eslint-disable-line n/consistent-type-specifier

import type { DgraphClientParams } from "../src/index.js"

const params: DgraphClientParams = {
  endpoint: "http://localhost:8080/graphql",
++ b/packages/adapter-dgraph/src/lib/client.ts
import * as jwt from "jsonwebtoken" // eslint-disable-line n/consistent-type-specifier

export interface DgraphClientParams {
  endpoint: string
++ b/packages/adapter-dgraph/src/lib/graphql/fragments.ts
