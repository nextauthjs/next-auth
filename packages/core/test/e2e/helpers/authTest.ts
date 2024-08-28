import { test as base } from "@playwright/test"
import { AuthFixture, createAuthFixture } from "../fixtures/auth"
import { WebApp } from "../fixtures/webApp"
import { KeycloakLoginPom } from "../poms/keycloakLoginPom"

type AuthJsWebappFixtures = {
  auth: AuthFixture
  keycloak: KeycloakLoginPom
  webapp: WebApp
}

export const test = base.extend<AuthJsWebappFixtures>({
  auth: async ({}, use) => {
    await use(createAuthFixture())
  },
  keycloak: async ({ page, auth }, use) => {
    await use(new KeycloakLoginPom({ page, auth }))
  },
  webapp: async ({ page, context, auth, keycloak }, use) => {
    await use(new WebApp({ page, context, auth, keycloak }))
  },
})

export { expect } from "@playwright/test"
