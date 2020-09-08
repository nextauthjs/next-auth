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

describe('Twitter (OAuth 1.1 flow)', async function () {
  this.slow(5000)
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

  it('should be returned to callback URL', async function () {
    // Wait for page to return to callback URL
    await page.waitForSelector('#nextauth-test-page')

    // Check we are at the correct callback URL
    assert.equal(page.url(), CALLBACK_URL)

    return Promise.resolve()
  })

  it('should be signed in', async function () {
    // Check we are signed in
    await page.waitForSelector('#nextauth-signed-in')
    return Promise.resolve()
  })

  after(async () => {
    await browser.close()
    return Promise.resolve()
  })
})