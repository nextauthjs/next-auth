import type { TypedDocumentString } from "./generated/graphql.js"

export interface HasuraAdapterClient {
  endpoint: string
  /**
   * `x-hasura-admin-secret` header value
   *
   * [Hasura Authentication](https://hasura.io/docs/search/?q=x-hasura-admin-secret)
   */
  adminSecret: string
}

export class HasuraClientError extends Error {
  name = "HasuraClientError"
  constructor(
    errors: any[],
    query: TypedDocumentString<any, any>,
    variables: any
  ) {
    super(errors.map((error) => error.message).join("\n"))
    console.error({ query, variables })
  }
}

export function client({ adminSecret, endpoint }: HasuraAdapterClient) {
  if (!adminSecret)
    throw new TypeError("Hasura client error: Please provide an adminSecret")

  if (!endpoint)
    throw new TypeError(
      "Hasura client error: Please provide a graphql endpoint"
    )

  return {
    async run<
      Q extends TypedDocumentString<any, any>,
      T extends Q extends TypedDocumentString<infer T, any> ? T : never,
      V extends Q extends TypedDocumentString<any, infer V> ? V : never,
    >(query: Q, variables?: V): Promise<T> {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": adminSecret,
        },
        body: JSON.stringify({ query, variables }),
      })

      const { data = {}, errors } = await response.json()

      if (errors?.length) throw new HasuraClientError(errors, query, variables)

      return data as T
    },
  }
}
