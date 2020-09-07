require('dotenv').config()
const assert = require('assert')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const BASE_URL = 'http://localhost:3000'
const CALLBACK_URL = `${BASE_URL}/test`

const {
  NEXTAUTH_GITHUB_USERNAME: USERNAME,
  NEXTAUTH_GITHUB_PASSWORD: PASSWORD
} = process.env

describe('GitHub (OAuth 2.0 flow)', function () {
  this.timeout(1000 * 60)
  it('should be able to sign in', async function () {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(`${BASE_URL}/api/auth/signin?callbackUrl=${encodeURIComponent(CALLBACK_URL)}`)

    await page.click(`form[action="${BASE_URL}/api/auth/signin/github"] button`)

    // Enter username
    await page.waitForSelector('input[name="login"]')
    await page.click('input[name="login"]')
    await page.keyboard.type(USERNAME)

    // Enter password
    await page.waitForSelector('input[name="password"]')
    await page.click('input[name="password"]')
    await page.keyboard.type(PASSWORD)

    // Click submit
    await page.click('form[action="/session"] [type="submit"]')

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