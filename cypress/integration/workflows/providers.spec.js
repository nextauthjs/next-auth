/// <reference types="Cypress" />

// This needs to be refactored as the links are now buttons as CSRF token 
// checking is done before starting an OAuth journey.

describe.skip("Users can sign in with various providers", async () => {
  beforeEach(() => {
    cy.visit("/");
    cy.findByRole("link", { name: "Sign in" }).click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/api/auth/signin");
    });
  });
  it("Signing in with Google", () => {
    cy.findByRole("link", { name: "Sign in with Google" }).click();

    cy.location().should((loc) => {
      expect(loc.hostname).to.eq("https://accounts.google.com");
      expect(loc.pathname).to.eq("/signin/oauth/oauthchooseaccount");
    });
  });
  it("Signing in with Facebook", () => {
    cy.findByRole("link", { name: "Sign in with Facebook" }).click();

    cy.location().should((loc) => {
      expect(loc.hostname).to.eq("www.facebook.com");
      expect(loc.pathname).to.eq("/v7.0/dialog/oauth");
    });
  });
  it("Signing in with Twitter", () => {
    cy.findByRole("link", { name: "Sign in with Twitter" }).click();

    cy.location().should((loc) => {
      expect(loc.hostname).to.eq("api.twitter.com");
      expect(loc.pathname).to.eq("/oauth/authenticate");
    });
  });
  it("Signing in with GitHub", () => {
    cy.findByRole("link", { name: "Sign in with GitHub" }).click();

    cy.location().should((loc) => {
      expect(loc.hostname).to.eq("github.com");
      expect(loc.pathname).to.eq("/login/oauth/authorize");
    });
  });
});
