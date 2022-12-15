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
    userId
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

export const CreateUserMutation = gql`
  mutation UserCreate($user: UserCreateInput!) {
    userCreate(input: $user) {
      user {
        ...UserFragment
      }
    }
  }
  ${UserFragment}
`

export const GetUserByIdQuery = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      ...UserFragment
    }
  }
  ${UserFragment}
`

export const GetUserByEmailQuery = gql`
  query GetUserByEmail($email: Email!) {
    user(by: { email: $email }) {
      ...UserFragment
    }
  }
  ${UserFragment}
`

export const UpdateUserByIdMutation = gql`
  mutation UpdateUserById($id: ID!, $user: UserUpdateInput!) {
    userUpdate(id: $id, input: $user) {
      user {
        ...UserFragment
      }
    }
  }
`

export const DeleteUserByIdMutation = gql`
  mutation DeleteUserById($id: ID!) {
    userDelete(id: $id) {
      deletedId
    }
  }
`

export const LinkAccountMutation = gql`
  mutation CreateAccountAndLinkUser($input: AccountCreateInput!) {
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

export const CreateSessionAndLinkUserMutation = gql`
  mutation CreateSessionAndLinkUser($input: SessionCreateInput!) {
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
