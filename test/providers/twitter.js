require('dotenv').config()

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const BASE_URL = 'http://localhost:3000'
const CALLBACK_URL = `${BASE_URL}/complete`
const USERNAME = process.env.TWITTER_USERNAME
const PASSWORD = process.env.TWITTER_PASSWORD

;(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true
    })
    let source
    const page = await browser.newPage()
    await page.goto(`${BASE_URL}/api/auth/signin?callbackUrl=${encodeURIComponent(CALLBACK_URL)}`)

    await page.click(`form[action="${BASE_URL}/api/auth/signin/twitter"] button`)

    // Enter username
    await page.waitForSelector('[name="session[username_or_email]"]')
    await page.click('[name="session[username_or_email]"]')
    await page.keyboard.type(USERNAME)

    // Enter password
    await page.waitForSelector('[name="session[password]"')
    await page.click('[name="session[password]"')
    await page.keyboard.type(PASSWORD)

    // Click submit
    await page.click('form[action="https://api.twitter.com/oauth/authenticate"] [type="submit"]')

    // Wait for page to submit and callback
    await page.waitForSelector('#__next')

    // Check callback URL
    if (page.url() != CALLBACK_URL)
      throw new Exception('Callback URL not correct')

    await browser.close()
    console.log("Twitter test passed.")
  } catch (err) {
    console.error("Twitter sign in failed", err)
    process.exit(1)
  }
})()