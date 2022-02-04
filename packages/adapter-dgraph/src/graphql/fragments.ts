export const User = /* GraphQL */ `
  fragment UserFragment on User {
    email
    id
    image
    name
    emailVerified
  }
`

export const Account = /* GraphQL */ `
  fragment AccountFragment on Account {
    id
    type
    provider
    providerAccountId
    expires_at
    token_type
    scope
    access_token
    refresh_token
    id_token
    session_state
  }
`
export const Session = /* GraphQL */ `
  fragment SessionFragment on Session {
    expires
    id
    sessionToken
  }
`

export const VerificationToken = /* GraphQL */ `
  fragment VerificationTokenFragment on VerificationToken {
    identifier
    token
    expires
  }
`
