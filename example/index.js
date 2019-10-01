/**
 * An example of how to use the NextAuth module.
 *
 * To invoke next-auth you will need to define a configuration block for your
 * site. You can create a next-auth.config.js file and put all your options
 * in it and pass it to next-auth when calling init().
 * 
 * A number of sample configuration files for various databases and
 * authentication options are provided.
 **/

// Include Next.js, Next Auth and a Next Auth config
const next = require('next')
const nextAuth = require('next-auth')
const nextAuthConfig = require('./next-auth.config')

// Load environment variables from .env
require('dotenv').config({ path: './.env' })

// Initialize Next.js
const nextApp = next({
  dir: '.',
  dev: (process.env.NODE_ENV === 'development')
})

// Add next-auth to next app
nextApp.prepare()
.then(async () => {
  // Load configuration and return config object
  const nextAuthOptions = await nextAuthConfig()

  // Pass Next.js App instance and NextAuth options to NextAuth
  const nextAuthApp = await nextAuth(nextApp, nextAuthOptions)  

  console.log(`Ready on http://localhost:${process.env.PORT || 3000}`)
})
.catch(err => {
  console.log('An error occurred, unable to start the server')
  console.log(err)
})
