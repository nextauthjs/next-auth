import { gql } from "graphql-request"

export const UserFragment = gql`
  fragment UserFragment on User {
    id
    email
    emailVerified
    name
    image
  }
`

export const AccountFragment = gql`
  fragment AccountFragment on Account {
    type
    provider
    providerAccountId
  }
`

export const TokenFragment = gql`
  fragment TokenFragment on Account {
    access_token: accessToken
    token_type: tokenType
    id_token: idToken
    refresh_token: refreshToken
    scope
    expires_at: expiresAt
    session_state: sessionState
  }
`

export const SessionFragment = gql`
  fragment SessionFragment on Session {
    expires
    id
    sessionToken
  }
`

export const VerificationTokenFragment = gql`
  fragment VerificationTokenFragment on VerificationToken {
    identifier
    token
    expires
  }
`

export const CreateUser = gql`
  mutation CreateUser($user: UserCreateInput!) {
    userCreate(input: $user) {
      user {
        ...UserFragment
      }
    }
  }
  ${UserFragment}
`

export const GetUser = gql`
  query GetUser($id: ID!) {
    user(by: { id: $id }) {
      ...UserFragment
    }
  }
  ${UserFragment}
`

export const GetUserByEmail = gql`
  query GetUserByEmail($email: Email!) {
    user(by: { email: $email }) {
      ...UserFragment
    }
  }
  ${UserFragment}
`

export const GetUserByAccount = gql`
  query GetUserByAccount(
    $providerAccountId: String! # $provider: String!
  ) {
    # TODO: @unique scope
    # account(
    #   by: {
    #     providerAccountIdProvider: {
    #       providerAccountId: $providerAccountId,
    #       provider: $provider
    #     }
    #   }
    # )
    account(by: { providerAccountId: $providerAccountId }) {
      ...AccountFragment
      user {
        ...UserFragment
      }
    }
  }
  ${AccountFragment}
  ${UserFragment}
`

export const UpdateUser = gql`
  mutation UpdateUser($id: ID!, $user: UserUpdateInput!) {
    userUpdate(by: { id: $id }, input: $user) {
      user {
        ...UserFragment
      }
    }
  }
`

export const DeleteUser = gql`
  mutation DeleteUser($id: ID!) {
    userDelete(by: { id: $id }) {
      deletedId
    }
  }
`

export const LinkAccount = gql`
  mutation CreateAccount($input: AccountCreateInput!) {
    accountCreate(input: $input) {
      account {
        ...TokenFragment
        ...AccountFragment
      }
    }
  }
  ${AccountFragment}
  ${TokenFragment}
`

export const UnlinkAccount = gql`
  mutation UnlinkAccount(
    $providerAccountId: String! # $provider: String!
  ) {
    # TODO: @unique scope
    deleteAccount(
      by: {
        # providerAccountIdProvider: {
        #   providerAccountId: $providerAccountId,
        #   provider: $provider
        # }
        providerAccountId: $providerAccountId
      }
    ) {
      deletedId
    }
  }
`

export const CreateSession = gql`
  mutation CreateSession($input: SessionCreateInput!) {
    sessionCreate(input: $input) {
      session {
        id
        expires
        sessionToken
        user {
          ...UserFragment
        }
      }
    }
  }
  ${UserFragment}
`

export const GetSessionAndUser = gql`
  query GetSessionAndUser(
    $sessionToken: String! # $provider: String!
  ) {
    session(by: { sessionToken: $sessionToken }) {
      ...SessionFragment
      user {
        ...UserFragment
      }
    }
  }
  ${SessionFragment}
  ${UserFragment}
`

export const UpdateSession = gql`
  mutation UpdateSession($sessionToken: String!, $input: SessionUpdateInput!) {
    sessionUpdate(by: { sessionToken: $sessionToken }, input: $input) {
      session {
        ...SessionFragment
      }
    }
  }
  ${SessionFragment}
`

export const DeleteSession = gql`
  mutation DeleteSession($sessionToken: String!) {
    sessionDelete(by: { sessionToken: $sessionToken }) {
      deletedId
    }
  }
`

export const CreateVerificationToken = gql`
  mutation CreateVerificationToken($input: VerificationTokenCreateInput!) {
    createVerificationToken(input: $input) {
      verificationToken {
        ...VerificationTokenFragment
      }
    }
  }
  ${VerificationTokenFragment}
`

export const UseVerificationToken = gql`
  mutation UseVerificationToken($token: String!) {
    sessionDelete(by: { token: $token }) {
      deletedId
    }
  }
`
