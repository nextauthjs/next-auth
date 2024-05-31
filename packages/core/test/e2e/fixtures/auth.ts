export type AuthFixture = {
  environmentUrl: string
  loginUser: string
  loginPassword: string
}
export function createAuthFixture(): AuthFixture {
  return {
    get environmentUrl() {
      const url = process.env.ENVIRONMENT_URL ?? "http://localhost:3000"

      return url
    },
    get loginUser() {
      const username = process.env.TEST_KEYCLOAK_USERNAME
      if (!username) throw new Error("Keycloak username is empty")

      return username
    },
    get loginPassword() {
      const password = process.env.TEST_KEYCLOAK_PASSWORD
      if (!password) throw new Error("Keycloak password is empty")

      return password
    },
  }
}
