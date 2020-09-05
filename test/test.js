require('dotenv').config()
const assert = require('assert')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const BASE_URL = 'http://localhost:3000'
const CALLBACK_URL = `${BASE_URL}/test`

const {
  TWITTER_USERNAME,
  TWITTER_PASSWORD
} = process.env

describe('Sign in', function () {
  this.timeout(1000 * 60) // 60 second timeout as default for each sign in test

  describe('OAuth 1.1', function () {
    it('should be able to sign in with Twitter', async function () {
      const browser = await puppeteer.launch({ headless: true })
      const page = await browser.newPage()
      await page.goto(`${BASE_URL}/api/auth/signin?callbackUrl=${encodeURIComponent(CALLBACK_URL)}`)

      await page.click(`form[action="${BASE_URL}/api/auth/signin/twitter"] button`)

      // Enter username
      await page.waitForSelector('[name="session[username_or_email]"]')
      await page.click('[name="session[username_or_email]"]')
      await page.keyboard.type(TWITTER_USERNAME)

      // Enter password
      await page.waitForSelector('[name="session[password]"')
      await page.click('[name="session[password]"')
      await page.keyboard.type(TWITTER_PASSWORD)

      // Click submit
      await page.click('form[action="https://api.twitter.com/oauth/authenticate"] [type="submit"]')

      // Wait for page to submit and callback
      await page.waitForSelector('#nextauth-test-page')

      // Get URL, end browser session
      const callbackUrl = page.url()
      await browser.close()

      // Check callback URL
      assert.equal(callbackUrl, CALLBACK_URL)

      return Promise.resolve()
    })
  })
})
