// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

describe('the email verification page', () => {
  beforeEach(() => {
    cy.visit('/api/auth/verify-request')
  })

  it('displays the call to action text', () => {
    cy.findByText('Check your email').should('be.visible')
    cy.findByText('A sign in link has been sent to your email address.').should(
      'be.visible'
    )
  })

  it('displays the call to action text', () => {
    debugger
    cy.location('host').then((hostUrl) => {
      cy.findByRole('link', { name: hostUrl }).should('be.visible')
    })
  })
})
