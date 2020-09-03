// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

describe("Email authentication workflow", async () => {
  beforeEach(() => {
    cy.visit("/");
    cy.findByRole("link", { name: "Sign in" }).click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/api/auth/signin");
    });
  });
  //   context("A valid email signup", () => {});
  it("An invalid email is entered", () => {
    cy.findByLabelText("Email").type("An invalid email");
    cy.findByRole("button", { name: "Sign in with Email" }).click();

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/api/auth/error");
    });

    cy.findByText("Sign in failed").should("be.visible");
    cy.findByText("Unable to send email.").should("be.visible");
    cy.findByRole("link", { name: "Sign in" }).should("be.visible");

    cy.findByRole("link", { name: "Sign in" }).click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/api/auth/signin");
    });
  });
});
