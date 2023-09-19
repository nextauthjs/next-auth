/* eslint-disable */
import * as types from "./graphql.js"

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  "mutation CreateAccount($data: accounts_insert_input!) {\n  insert_accounts_one(object: $data) {\n    ...Account\n  }\n}\n\nmutation DeleteAccount($provider: String!, $providerAccountId: String!) {\n  delete_accounts(\n    where: {provider: {_eq: $provider}, providerAccountId: {_eq: $providerAccountId}}\n  ) {\n    returning {\n      ...Account\n    }\n  }\n}\n\nquery GetAccount($provider: String!, $providerAccountId: String!) {\n  accounts(\n    where: {provider: {_eq: $provider}, providerAccountId: {_eq: $providerAccountId}}\n  ) {\n    ...Account\n  }\n}":
    types.CreateAccountDocument,
  "mutation DeleteAll {\n  delete_accounts(where: {}) {\n    affected_rows\n  }\n  delete_sessions(where: {}) {\n    affected_rows\n  }\n  delete_users(where: {}) {\n    affected_rows\n  }\n  delete_verification_tokens(where: {}) {\n    affected_rows\n  }\n}":
    types.DeleteAllDocument,
  "fragment User on users {\n  id\n  name\n  email\n  image\n  emailVerified\n}\n\nfragment Session on sessions {\n  id\n  userId\n  expires\n  sessionToken\n}\n\nfragment Account on accounts {\n  id\n  type\n  scope\n  userId\n  id_token\n  provider\n  expires_at\n  token_type\n  access_token\n  refresh_token\n  session_state\n  providerAccountId\n}\n\nfragment VerificationToken on verification_tokens {\n  token\n  expires\n  identifier\n}":
    types.UserFragmentDoc,
  "query GetSessionAndUser($sessionToken: String!) {\n  sessions(where: {sessionToken: {_eq: $sessionToken}}) {\n    ...Session\n    user {\n      ...User\n    }\n  }\n}\n\nquery GetSession($sessionToken: String!) {\n  sessions_by_pk(sessionToken: $sessionToken) {\n    ...Session\n  }\n}\n\nmutation CreateSession($data: sessions_insert_input!) {\n  insert_sessions_one(object: $data) {\n    ...Session\n  }\n}\n\nmutation UpdateSession($sessionToken: String, $data: sessions_set_input!) {\n  update_sessions(where: {sessionToken: {_eq: $sessionToken}}, _set: $data) {\n    returning {\n      ...Session\n    }\n  }\n}\n\nmutation DeleteSession($sessionToken: String!) {\n  delete_sessions(where: {sessionToken: {_eq: $sessionToken}}) {\n    returning {\n      ...Session\n    }\n  }\n}":
    types.GetSessionAndUserDocument,
  "query GetUser($id: uuid!) {\n  users_by_pk(id: $id) {\n    ...User\n  }\n}\n\nquery GetUsers($where: users_bool_exp!) {\n  users(where: $where) {\n    ...User\n  }\n}\n\nmutation CreateUser($data: users_insert_input!) {\n  insert_users_one(object: $data) {\n    ...User\n  }\n}\n\nmutation UpdateUser($id: uuid!, $data: users_set_input!) {\n  update_users_by_pk(pk_columns: {id: $id}, _set: $data) {\n    ...User\n  }\n}\n\nmutation DeleteUser($id: uuid!) {\n  delete_users_by_pk(id: $id) {\n    ...User\n  }\n}":
    types.GetUserDocument,
  "mutation CreateVerificationToken($data: verification_tokens_insert_input!) {\n  insert_verification_tokens_one(object: $data) {\n    ...VerificationToken\n  }\n}\n\nmutation DeleteVerificationToken($identifier: String!, $token: String!) {\n  delete_verification_tokens(\n    where: {token: {_eq: $token}, identifier: {_eq: $identifier}}\n  ) {\n    returning {\n      ...VerificationToken\n    }\n  }\n}\n\nquery GetVerificationToken($identifier: String!, $token: String!) {\n  verification_tokens(\n    where: {token: {_eq: $token}, identifier: {_eq: $identifier}}\n  ) {\n    ...VerificationToken\n  }\n}":
    types.CreateVerificationTokenDocument,
}

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation CreateAccount($data: accounts_insert_input!) {\n  insert_accounts_one(object: $data) {\n    ...Account\n  }\n}\n\nmutation DeleteAccount($provider: String!, $providerAccountId: String!) {\n  delete_accounts(\n    where: {provider: {_eq: $provider}, providerAccountId: {_eq: $providerAccountId}}\n  ) {\n    returning {\n      ...Account\n    }\n  }\n}\n\nquery GetAccount($provider: String!, $providerAccountId: String!) {\n  accounts(\n    where: {provider: {_eq: $provider}, providerAccountId: {_eq: $providerAccountId}}\n  ) {\n    ...Account\n  }\n}"
): typeof import("./graphql.js").CreateAccountDocument
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation DeleteAll {\n  delete_accounts(where: {}) {\n    affected_rows\n  }\n  delete_sessions(where: {}) {\n    affected_rows\n  }\n  delete_users(where: {}) {\n    affected_rows\n  }\n  delete_verification_tokens(where: {}) {\n    affected_rows\n  }\n}"
): typeof import("./graphql.js").DeleteAllDocument
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "fragment User on users {\n  id\n  name\n  email\n  image\n  emailVerified\n}\n\nfragment Session on sessions {\n  id\n  userId\n  expires\n  sessionToken\n}\n\nfragment Account on accounts {\n  id\n  type\n  scope\n  userId\n  id_token\n  provider\n  expires_at\n  token_type\n  access_token\n  refresh_token\n  session_state\n  providerAccountId\n}\n\nfragment VerificationToken on verification_tokens {\n  token\n  expires\n  identifier\n}"
): typeof import("./graphql.js").UserFragmentDoc
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query GetSessionAndUser($sessionToken: String!) {\n  sessions(where: {sessionToken: {_eq: $sessionToken}}) {\n    ...Session\n    user {\n      ...User\n    }\n  }\n}\n\nquery GetSession($sessionToken: String!) {\n  sessions_by_pk(sessionToken: $sessionToken) {\n    ...Session\n  }\n}\n\nmutation CreateSession($data: sessions_insert_input!) {\n  insert_sessions_one(object: $data) {\n    ...Session\n  }\n}\n\nmutation UpdateSession($sessionToken: String, $data: sessions_set_input!) {\n  update_sessions(where: {sessionToken: {_eq: $sessionToken}}, _set: $data) {\n    returning {\n      ...Session\n    }\n  }\n}\n\nmutation DeleteSession($sessionToken: String!) {\n  delete_sessions(where: {sessionToken: {_eq: $sessionToken}}) {\n    returning {\n      ...Session\n    }\n  }\n}"
): typeof import("./graphql.js").GetSessionAndUserDocument
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query GetUser($id: uuid!) {\n  users_by_pk(id: $id) {\n    ...User\n  }\n}\n\nquery GetUsers($where: users_bool_exp!) {\n  users(where: $where) {\n    ...User\n  }\n}\n\nmutation CreateUser($data: users_insert_input!) {\n  insert_users_one(object: $data) {\n    ...User\n  }\n}\n\nmutation UpdateUser($id: uuid!, $data: users_set_input!) {\n  update_users_by_pk(pk_columns: {id: $id}, _set: $data) {\n    ...User\n  }\n}\n\nmutation DeleteUser($id: uuid!) {\n  delete_users_by_pk(id: $id) {\n    ...User\n  }\n}"
): typeof import("./graphql.js").GetUserDocument
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation CreateVerificationToken($data: verification_tokens_insert_input!) {\n  insert_verification_tokens_one(object: $data) {\n    ...VerificationToken\n  }\n}\n\nmutation DeleteVerificationToken($identifier: String!, $token: String!) {\n  delete_verification_tokens(\n    where: {token: {_eq: $token}, identifier: {_eq: $identifier}}\n  ) {\n    returning {\n      ...VerificationToken\n    }\n  }\n}\n\nquery GetVerificationToken($identifier: String!, $token: String!) {\n  verification_tokens(\n    where: {token: {_eq: $token}, identifier: {_eq: $identifier}}\n  ) {\n    ...VerificationToken\n  }\n}"
): typeof import("./graphql.js").CreateVerificationTokenDocument

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}
