/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-base-to-string */
import { format } from "./utils"
import { Models, Model, models } from "./graphql/models"

import type { Adapter, AdapterUser } from "next-auth/adapters"
import { Account } from "next-auth"

export type { Models, Model }

export interface HasuraClientOptions {
  /** GraphQL endpoint */
  url: string
  /**
   * `X-Hasura-Admin-Secret` header value
   *
   * [Securing the GraphQL endpoint](https://hasura.io/docs/latest/deployment/securing-graphql-endpoint/)
   */
  adminSecret: string
}

export interface HasuraAdapterOptions {
  client: HasuraClientOptions
  models?: Partial<Models>
}

export function HasuraAdapter(options: HasuraAdapterOptions): Adapter {
  const c = client(options.client)
  const m: Models = {
    User: { ...models.User, ...options.models?.User },
    Account: { ...models.Account, ...options.models?.Account },
    Session: { ...models.Session, ...options.models?.Session },
    VerificationToken: {
      ...models.VerificationToken,
      ...options.models?.VerificationToken,
    },
  }
  return {
    async createUser(data) {
      const result = await c.run<AdapterUser[]>(
        /* GraphQL */ `
          mutation ($data: [${m.User.name}_insert_input!]!) {
            insert_${m.User.name}(objects: $data) {
              returning {
                ${m.User.fields.join(" ")}
              }
            }
          }
        `,
        { data }
      )
      return format.from(result?.[0])
    },
    async getUser(id) {
      const result = await c.run<AdapterUser>(
        /* GraphQL */ `
          query ($id: String!) {
            ${m.User.name}(where: { id: { _eq: $id } }) {
              ${m.User.fields.join(" ")}
            }
          }
        `,
        { id }
      )

      return format.from(result)
    },
    async getUserByEmail(email) {
      const result = await c.run<AdapterUser[]>(
        /* GraphQL */ `
          query ($email: String!) {
            ${m.User.name}(where: { email: { _eq: $email } }) {
              ${m.User.fields.join(" ")}
            }
          }
        `,
        { email }
      )
      return result?.[0] ?? null
    },
    async getUserByAccount(provider_providerAccountId) {
      const result = await c.run<Array<AdapterUser & { Accounts: Account }>>(
        /* GraphQL */ `
        query getUserByAccount($providerAccountId: String!, $provider: String!) {
          ${m.User.name}(
            where: {Accounts: {providerAccountId: {_eq: $providerAccountId}, provider: {_eq: $provider}}}
          ) {
            ${m.User.fields.join(" ")}
          }
        }
        `,
        provider_providerAccountId
      )

      if (!result?.length) return null
      const { Accounts: _, ...user } = result[0]
      return user
    },
    async updateUser({ id, ...input }) {
      throw new HasuraAdapterError("`updateUser` not implemented")
    },
    async deleteUser(id) {
      throw new HasuraAdapterError("`deleteUser` not implemented")
    },
    async linkAccount(data) {
      throw new HasuraAdapterError("`linkAccount` not implemented")
    },
    async unlinkAccount(provider_providerAccountId) {
      throw new HasuraAdapterError("`unlinkAccount` not implemented")
    },
    async getSessionAndUser(sessionToken) {
      throw new HasuraAdapterError("`getSessionAndUser` not implemented")
    },
    async createSession(data) {
      throw new HasuraAdapterError("`createSession` not implemented")
    },
    async updateSession({ sessionToken, ...input }) {
      throw new HasuraAdapterError("`updateSession` not implemented")
    },
    async deleteSession(sessionToken) {
      throw new HasuraAdapterError("`deleteSession` not implemented")
    },
    async createVerificationToken(input) {
      throw new HasuraAdapterError("`createVerificationToken` not implemented")
    },
    async useVerificationToken(params) {
      throw new HasuraAdapterError("`useVerificationToken` not implemented")
    },
  }
}

export class HasuraAdapterError extends Error {
  name = "HasuraAdapterError"
  query?: string
  variables?: any
  constructor(
    e: Error | string | Array<Error | string>,
    query?: string,
    variables?: any
  ) {
    // @ts-expect-error
    super(Array.isArray(e) ? e.map((e) => e.message ?? e).join("\n") : e.m ?? e)
    this.query = query
    this.variables = variables
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      query: this.query,
      variables: this.variables,
    }
  }

  toString() {
    const items = [
      this.message,
      this.query,
      JSON.stringify(this.variables, null, 2),
    ].filter(Boolean)
    return `${this.name}: ${items.join("\n")}`
  }
}

export function client(options: HasuraClientOptions) {
  if (!globalThis.fetch) {
    throw new HasuraAdapterError("Please provide a `fetch` implementation")
  }

  const { url, adminSecret } = options

  if (!adminSecret) {
    throw new HasuraAdapterError("Please provide an API key")
  }

  if (!url) {
    throw new HasuraAdapterError("Please provide a GraphQL endpoint")
  }

  return {
    async run<T>(
      query: string,
      variables?: Record<string, any>
    ): Promise<T | null> {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Hasura-Admin-Secret": adminSecret,
          },
          body: JSON.stringify({ query, variables }),
        })

        const { data = {}, errors } = await response.json()
        if (errors?.length) {
          throw new HasuraAdapterError(errors, query, variables)
        }
        return Object.values(data)[0] as any
      } catch (error) {
        if (error instanceof HasuraAdapterError) throw error
        throw new HasuraAdapterError(error as Error, query, variables)
      }
    },
  }
}

export { format, models }
