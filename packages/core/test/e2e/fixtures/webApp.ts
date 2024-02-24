import {
  expect,
  type BrowserContext,
  type Locator,
  type Page,
} from "@playwright/test"
import { AuthFixture } from "./auth"
import { KeycloakLoginPom } from "../poms/keycloakLoginPom"

/**
 * This fixture provides utility methods for logging in,
 * navigating and clicking common elements.
 */
export class WebApp {
  #auth: AuthFixture
  private keycloak: KeycloakLoginPom

  public page: Page
  public context: BrowserContext

  public isLoggedIn = false

  // locators
  public signinButton: Locator
  public session: Record<string, any>

  constructor({
    page,
    context,
    auth,
    keycloak,
  }: {
    page: Page
    context: BrowserContext
    auth: AuthFixture
    keycloak: KeycloakLoginPom
  }) {
    this.#auth = auth

    this.keycloak = keycloak
    this.page = page
    this.context = context

    this.signinButton = page
      .getByRole("banner")
      .getByRole("button", { name: "Sign in" })

    this.session = {}
  }

  async login({
    environmentUrl = this.#auth.environmentUrl,
    username,
    password,
  }: {
    environmentUrl?: string
    username?: string
    password?: string
  } = {}) {
    if (this.isLoggedIn) return

    // Go to homepage
    await this.page.goto(environmentUrl)
    await this.signinButton.click()

    // On built-in signin page, select Keycloak
    await this.page.getByText("Keycloak").click()

    // Use keycloak POM to login
    await this.keycloak.login({ username, password })

    // Ensure we've landed back at the dev app logged in
    const session = await this.page.locator("pre").textContent()

    expect(JSON.parse(session ?? "{}").user.email).toEqual("bob@alice.com")

    this.isLoggedIn = true
  }

  async getSession({
    environmentUrl = this.#auth.environmentUrl,
  }: {
    environmentUrl?: string
  } = {}) {
    if (!this.isLoggedIn) return

    try {
      const response = await this.page.goto(`${environmentUrl}/auth/session`)
      if (response?.ok()) {
        this.session = await response?.json()
      }
    } catch (error) {
      console.error(error)
    }
  }
}
