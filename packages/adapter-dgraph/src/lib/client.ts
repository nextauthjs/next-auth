import * as jwt from "jsonwebtoken"

export interface DgraphClientParams {
  endpoint: string
  /**
   * `X-Auth-Token` header value
   *
   * [Dgraph Cloud Authentication](https://dgraph.io/docs/cloud/cloud-api/overview/#dgraph-cloud-authentication)
   */
  authToken: string
  /**
   * [Using JWT and authorization claims](https://dgraph.io/docs/graphql/authorization/authorization-overview#using-jwts-and-authorization-claims)
   */
  jwtSecret?: string
  /**
   * @default "HS512"
   *
   * Note: The default JWT algorithm is now HS512, since [Dgraph now supports HS512 algorithm](https://github.com/dgraph-io/dgraph/pull/8912) and it aligns with NextAuth.js defaults.
   * HS256 and RS256 are still supported for backward compatibility.
   *
   * [Using JWT and authorization claims](https://dgraph.io/docs/graphql/authorization/authorization-overview#using-jwts-and-authorization-claims)
   */
  jwtAlgorithm?: "HS512" | "HS256" | "RS256"
  /**
   * @default "Authorization"
   *
   * [Using JWT and authorization claims](https://dgraph.io/docs/graphql/authorization/authorization-overview#using-jwts-and-authorization-claims)
   */
  authHeader?: string
}

export class DgraphClientError extends Error {
  name = "DgraphClientError"
  query: string
  variables: any
  originalErrors: any[]

  constructor(errors: any[], query: string, variables: any) {
    super(`GraphQL query failed with ${errors.length} errors.`)
    this.originalErrors = errors
    this.query = query
    this.variables = variables
    Error.captureStackTrace(this, this.constructor)
  }
}

export function client(params: DgraphClientParams) {
  if (!params.authToken) {
    throw new Error("Dgraph client error: Please provide an API key")
  }
  if (!params.endpoint) {
    throw new Error(
      "Dgraph client error: Please provide a valid GraphQL endpoint"
    )
  }

  const {
    endpoint,
    authToken,
    jwtSecret,
    jwtAlgorithm = "HS512",
    authHeader = "Authorization",
  } = params

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Auth-Token": authToken,
  }

  if (jwtSecret) {
    headers[authHeader] = jwt.sign({ nextAuth: true }, jwtSecret, {
      algorithm: jwtAlgorithm,
    })
  }

  return {
    async run<T>(
      query: string,
      variables?: Record<string, any>
    ): Promise<T | null> {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({ query, variables }),
        })

        if (!response.ok) {
          throw new Error(
            `HTTP error ${response.status}: ${response.statusText}`
          )
        }

        const { data = {}, errors } = await response.json()
        if (errors?.length) {
          throw new DgraphClientError(errors, query, variables)
        }

        return Object.values(data)[0] as T | null
      } catch (error) {
        console.error(`Error executing GraphQL query: ${error}`, {
          query,
          variables,
        })
        throw error
      }
    },
  }
}
