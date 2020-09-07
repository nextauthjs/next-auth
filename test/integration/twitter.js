require('dotenv').config()
const assert = require('assert')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const BASE_URL = 'http://localhost:3000'
const CALLBACK_URL = `${BASE_URL}/test`

const {
  NEXTAUTH_TWITTER_USERNAME: USERNAME,
  NEXTAUTH_TWITTER_PASSWORD: PASSWORD
} = process.env

describe('Twitter (OAuth 1.1 flow)', function () {
  this.timeout(1000 * 60)
  it('should be able to sign in', async function () {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    page.setDefaultTimeout(1000 * 60)
    await page.goto(`${BASE_URL}/api/auth/signin?callbackUrl=${encodeURIComponent(CALLBACK_URL)}`)

    await page.click(`form[action="${BASE_URL}/api/auth/signin/twitter"] button`)

    // Enter username
    await page.waitForSelector('input[name="session[username_or_email]"]')
    await page.click('input[name="session[username_or_email]"]')
    await page.keyboard.type(USERNAME)

    // Enter password
    await page.waitForSelector('input[name="session[password]"]')
    await page.click('input[name="session[password]"]')
    await page.keyboard.type(PASSWORD)

    // Click submit
    await page.click('form[action="https://api.twitter.com/oauth/authenticate"] [type="submit"]')

    // Wait for page to submit and callback
    await page.waitForSelector('#nextauth-signed-in')

    // Get URL, end browser session
    const callbackUrl = page.url()
    await browser.close()

    // Check callback URL
    assert.equal(callbackUrl, CALLBACK_URL)

    return Promise.resolve()
  })
})