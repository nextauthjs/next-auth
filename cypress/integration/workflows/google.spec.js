describe.skip('Google', () => {
  before(() => {
    cy.visit('/api/auth/signin')
  })
  it('Sign in with Google', () => {

    const username = Cypress.env('GOOGLE_USERNAME')
    const password = Cypress.env('GOOGLE_PASSWORD')
    const siteName = Cypress.env('SITE_NAME')
    const cookieName = Cypress.env('COOKIE_NAME')

    const socialLoginOptions = {
      username,
      password,
      loginUrl: `${siteName}/api/auth/signin`,
      headless: true,
      logs: false,
      isPopup: true,
      //loginSelector: `form[action="${siteName}/api/auth/signin/google"] button`
      loginSelector: `:nth-child(6) > form > .button`
    }

    return cy
      .task('GoogleSocialLogin', socialLoginOptions)
      .then(({ cookies }) => {
        cy.clearCookies()

        const cookie = cookies
          .filter(cookie => cookie.name === cookieName)
          .pop()
        if (cookie) {
          cy.setCookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            expiry: cookie.expires,
            httpOnly: cookie.httpOnly,
            path: cookie.path,
            secure: cookie.secure,
          })

          Cypress.Cookies.defaults({
            whitelist: cookieName,
          })
          cy.visit('/api/auth/signout')
          cy.get('form').submit()
        }
      })
  })
})