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
    await page.waitForSelector(`form[action="${BASE_URL}/api/auth/signin/google"] button`)
    await page.click(`form[action="${BASE_URL}/api/auth/signin/google"] button`)
    return Promise.resolve()
  })

  it('should be redirected to provider', async function () {
    // Enter username
    await page.waitForSelector('input[type="email"]')
    await page.click('input[type="email"]')
    await page.keyboard.type(USERNAME)

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
    return Promise.resolve()
  })

  it('should be able to sign in with provider', async function () {
    // Click submit
    await page.click('button[type="button"]')
    return Promise.resolve()
  })

  it('should be returned to callback URL', async function () {
    // Wait for page to return to callback URL
    await page.waitForSelector('#nextauth-test-page')

    // Check we are at the correct callback URL
    // Note: Google OAuth appends a # to the end of the URL in Chrome
    assert.equal(page.url(), `${CALLBACK_URL}#`)

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