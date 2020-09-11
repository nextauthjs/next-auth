const puppeteerExtra = require('puppeteer-extra')
const StealthPlugin = require("puppeteer-extra-plugin-stealth")
const stealthPlugin = StealthPlugin()

// Override Puppeteer user agent to set 'navigator.platform' explicitly to
// prevent detection on some providers (e.g. GitHub OAuth) as they force 2FA
// on sign in if they detect sign in from a platform they haven't seen before.
const puppeteerExtraPluginUserAgentOverride = require("puppeteer-extra-plugin-stealth/evasions/user-agent-override")
stealthPlugin.enabledEvasions.delete("user-agent-override")
puppeteerExtra.use(stealthPlugin)
const pluginUserAgentOverride = puppeteerExtraPluginUserAgentOverride({
   userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36",
   platform: "MacIntel"
})
puppeteerExtra.use(pluginUserAgentOverride)

// CI is set to true by GitHub Actions to indicate is running in CD/CI
const { CI } = process.env

const puppeteerOptions = { 
  headless: true  // Set to 'false' to debug more easily
}

// When running on remote test runner (which is ARM) the executable path
// needs to be set to 'chromium-browser' so it uses the ARM build of Chromium
// not the x86 build that Puppeteer uses by default. Supporting this allows us
// to test easily from remote locations that are outside cloud networks like
// AWS, GPC, Azure, etc. and avoids tests being thwarted by IP blocklists.
if (CI)
  puppeteerOptions.executablePath = 'chromium-browser'

module.exports = {
  puppeteer: puppeteerExtra,
  puppeteerOptions
}