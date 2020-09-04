/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************
const dotenvPlugin = require('cypress-dotenv')
const { GoogleSocialLogin } = require('cypress-social-logins').plugins

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  config = dotenvPlugin(config)

  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    GoogleSocialLogin
  })

  on("before:browser:launch", (browser = {}, options) => {
    if (browser.name === "chrome")
      options.args.push("--disable-site-isolation-trials")

    return options
  })

  return config
}
