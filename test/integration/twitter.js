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

describe.only('Twitter (OAuth 1.1 flow)', async function () {
  this.timeout(1000 * 60)

  let browser,page

  before(async () => {
    browser = await puppeteer.launch({ headless: true })
    page = await browser.newPage()
    return Promise.resolve()
  })

  it('should show button on sign in page', async function () {
    page.setDefaultTimeout(1000 * 60)
    await page.goto(`${BASE_URL}/api/auth/signin?callbackUrl=${encodeURIComponent(CALLBACK_URL)}`)
    await page.waitForSelector(`form[action="${BASE_URL}/api/auth/signin/twitter"] button`)
    await page.click(`form[action="${BASE_URL}/api/auth/signin/twitter"] button`)
    return Promise.resolve()
  })

  it('should be redirected to provider', async function () {
    // Enter username
    await page.waitForSelector('input[name="session[username_or_email]"]')
    await page.click('input[name="session[username_or_email]"]')
    await page.keyboard.type(USERNAME)

    // Enter password
    await page.waitForSelector('input[name="session[password]"]')
    await page.click('input[name="session[password]"]')
    await page.keyboard.type(PASSWORD)
    return Promise.resolve()
  })

  it('should be able to sign in with provider', async function () {
    // Click submit
    await page.click('form[action="https://api.twitter.com/oauth/authenticate"] [type="submit"]')
    return Promise.resolve()
  })

  it('should be returned to app and signed in', async function () {
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