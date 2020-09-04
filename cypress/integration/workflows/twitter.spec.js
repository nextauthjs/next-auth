describe.skip('Twitter', () => {
  before(() => {
    cy.visit('/api/auth/signin/')
  })
  it('Sign in with Twitter', () => {
    const username = Cypress.env('TWITTER_USERNAME')
    const password = Cypress.env('TWITTER_PASSWORD')
    const siteName = Cypress.env('SITE_NAME')
    const cookieName = Cypress.env('COOKIE_NAME')

    const socialLoginOptions = {
      username,
      password,
      loginUrl: siteName,
      headless: true,
      logs: false,
      isPopup: true,
      loginSelector: `form[action="${siteName}/api/auth/signin/twitter"] button`,
      postLoginSelector: '.unread-count',
    }

    return cy
      .task('TwitterSocialLogin', socialLoginOptions)
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