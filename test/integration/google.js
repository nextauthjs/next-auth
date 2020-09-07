require('dotenv').config()
const assert = require('assert')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const BASE_URL = 'http://localhost:3000'
const CALLBACK_URL = `${BASE_URL}/test`

const {
  NEXTAUTH_GOOGLE_USERNAME: USERNAME,
  NEXTAUTH_GOOGLE_PASSWORD: PASSWORD
} = process.env

// This seems to stall because of a popup that is displayed only when using
// puppeteer. See FIXME below. Would appreciate any help resolving it.
describe.skip('Google (OAuth 2.0 flow)', function () {
  this.timeout(1000 * 60)
  it('should be able to sign in', async function () {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    page.setDefaultTimeout(1000 * 60)
    await page.goto(`${BASE_URL}/api/auth/signin?callbackUrl=${encodeURIComponent(CALLBACK_URL)}`)

    await page.click(`form[action="${BASE_URL}/api/auth/signin/google"] button`)

    // Enter username
    await page.waitForSelector('input[type="email"]')
    await page.click('input[type="email"]')
    await page.keyboard.type(USERNAME)
    await page.click('button[type="button"]')

    // Dismiss confirmation dialog
    // FIXME Work out how to dismiss popup
    // A popup *only* appears when using puppeteer (not manually) but I can't
    // get the xPath selectors to work to dismiss it. This is as close as I got.
    // await page.waitForXPath("(//span[contains(text(), 'Got it')])[2]")
    // const element = await page.$x("(//span[contains(text(), 'Got it')])[2]")
    // await element.click()

    // Enter password
    await page.waitForSelector('input[type="password"]')
    await page.click('input[type="password"]')
    await page.keyboard.type(PASSWORD)
    await page.click('button[type="button"]')

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