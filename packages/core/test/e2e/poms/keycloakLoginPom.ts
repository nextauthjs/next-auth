import { expect, type Locator, type Page } from "@playwright/test"
import type { AuthFixture } from "../fixtures/auth"

export class KeycloakLoginPom {
  usernameInput: Locator
  passwordInput: Locator
  signinButton: Locator

  #auth: AuthFixture

  constructor({ page, auth }: { page: Page; auth: AuthFixture }) {
    this.#auth = auth

    this.usernameInput = page.getByLabel("Username or email")
    this.passwordInput = page.locator("#password")

    this.signinButton = page.getByRole("button", { name: "Sign In" })
  }

  async login({
    username = this.#auth.loginUser,
    password = this.#auth.loginPassword,
  }: {
    username?: string
    password?: string
  } = {}) {
    if (!username) throw new Error("Keycloak username missing")
    if (!password) throw new Error("Keycloak password missing")

    await this.isVisible()

    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)

    return this.signinButton.click()
  }

  isVisible() {
    return Promise.all([
      expect(this.usernameInput).toBeVisible(),
      expect(this.passwordInput).toBeVisible(),
      expect(this.signinButton).toBeVisible(),
    ])
  }
}
