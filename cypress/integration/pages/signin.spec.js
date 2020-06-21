// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

describe("the sign in page", () => {
  beforeEach(() => {
    cy.visit("/api/auth/signin");
  });
  it("displays the configured provider sign in buttons", () => {
    const providers = ["Email", "Google", "Facebook", "Twitter", "GitHub"];
    providers.forEach((provider) => {
      const isEmailProvider = provider == "Email";
      const role = isEmailProvider ? "button" : "link";

      cy.findByRole(role, { name: `Sign in with ${provider}` }).should(
        "be.visible"
      );

      if (isEmailProvider) {
        cy.findByLabelText("Email").should("be.visible");
      }
    });
  });
});
