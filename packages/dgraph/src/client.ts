import * as jwt from "jsonwebtoken"
import fetch from "node-fetch"

import type { HeadersInit } from "node-fetch"

export interface DgraphClientParams {
  endpoint: string
  /**
   * `X-Auth-Token` header value
   *
   * [Dgraph Cloud Authentication](https://dgraph.io/docs/cloud/cloud-api/overview/#dgraph-cloud-authentication)
   */
  authToken: string
  /** [Using JWT and authorization claims](https://dgraph.io/docs/graphql/authorization/authorization-overview#using-jwts-and-authorization-claims) */
  jwtSecret?: string
  /**
   * @default "RS256"
   *
   * [Using JWT and authorization claims](https://dgraph.io/docs/graphql/authorization/authorization-overview#using-jwts-and-authorization-claims)
   */
  jwtAlgorithm?: "HS256" | "RS256"
  /**
   * @default "Authorization"
   *
   * [Using JWT and authorization claims](https://dgraph.io/docs/graphql/authorization/authorization-overview#using-jwts-and-authorization-claims)
   */
  authHeader?: string
}

export class DgraphClientError extends Error {
  name = "DgraphClientError"
  constructor(errors: any[], query: string, variables: any) {
    super(errors.map((error) => error.message).join("\n"))
    console.error({ query, variables })
  }
}

export function client(params: DgraphClientParams) {
  if (!params.authToken) {
    throw new Error("Dgraph client error: Please provide an api key")
  }
  if (!params.endpoint) {
    throw new Error("Dgraph client error: Please provide a graphql endpoint")
  }

  const {
    endpoint,
    authToken,
    jwtSecret,
    jwtAlgorithm = "HS256",
    authHeader = "Authorization",
  } = params
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Auth-Token": authToken,
  }

  if (authHeader && jwtSecret) {
    headers[authHeader] = jwt.sign({ nextAuth: true }, jwtSecret, {
      algorithm: jwtAlgorithm,
    })
  }

  return {
    async run<T>(
      query: string,
      variables?: Record<string, any>
    ): Promise<T | null> {
      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ query, variables }),
      })

      const { data = {}, errors } = await response.json()
      if (errors?.length) {
        throw new DgraphClientError(errors, query, variables)
      }
      return Object.values(data)[0] as any
    },
  }
}
