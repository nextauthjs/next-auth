/**
 * next-auth.config.js Example
 *
 * Environment variables for this example:
 *
 * PORT=3000
 * SERVER_URL=http://localhost:3000
 * MONGO_URI=mongodb://localhost:27017/my-database
 * EMAIL_FROM=username@gmail.com
 * EMAIL_SERVER=smtp.gmail.com
 * EMAIL_PORT=465
 * EMAIL_USERNAME=username@gmail.com
 * EMAIL_PASSWORD=p4ssw0rd
 *
 * If you wish, you can put these in a `.env` to seperate your environment 
 * specific configuration from your code.
 **/

// Load environment variables from a .env file if one exists
require('dotenv').load()

const nextAuthProviders = require('./next-auth.providers')
const nextAuthFunctions = require('./next-auth.functions')

// If we want to pass a custom session store then we also need to pass an 
// instance of Express Session along with it.
const expressSession = require('express-session')
const MongoStore = require('connect-mongo')(expressSession)

// If no store set, NextAuth defaults to using Express Sessions in-memory
// session store (the fallback is intended as fallback for testing only).
let sessonStore 
if (process.env.MONGO_URI) { 
  sessonStore = new MongoStore({
     url: process.env.MONGO_URI,
     autoRemove: 'interval',
     autoRemoveInterval: 10, // Removes expired sessions every 10 minutes
     collection: 'sessions',
     stringify: false
  })
}  

module.exports = () => {
  // We connect to the User DB before we define our functions. 
  // next-auth.functions.js returns an async method that does that and returns 
  // an object with the functions needed for authentication.
  return nextAuthFunctions()
  .then(functions => {
    return new Promise((resolve, reject) => {    
      // This is the config block we return, ready to be passed to NextAuth
      resolve({
        // Define a port (if none passed, will not start Express)
        port: process.env.PORT || 3000,
        // Set canonical URL (optional)
        serverUrl: process.env.SERVER_URL || null,
        // Add an Express Session store.
        expressSession: expressSession,
        sessionStore: sessonStore,
        // Define oAuth Providers
        providers: nextAuthProviders(),
        // Add functions for finding, inserting and updating users.
        functions: functions
      })
    })
  })
}