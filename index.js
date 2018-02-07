'use strict'

const BodyParser = require('body-parser')
const Express = require('express')
const ExpressSession = require('express-session')
const lusca = require('lusca')
const passportStrategies = require('./src/passport-strategies')
const uuid = require('uuid/v4')

module.exports = (nextApp, {
  bodyParser = true,
  csrf = true,
  // URL base path for authentication routes (optional).
  // Note: The prefix value of '/auth' is currently hard coded in 
  // next-auth-client so you should not change this unless you also modify it.
  pathPrefix = '/auth',
  // Express Server (optional).
  expressApp = null,
  // Express Session (optional).
  expressSession = ExpressSession,
  // Secret used to encrypt session data on the server.
  sessionSecret = 'change-me',
  // Session store for express-session. 
  // Defaults to an in memory store, which is not recommended for production.
  sessionStore = expressSession.MemoryStore(),
  // Maximum Session Age in ms (optional, default is 7 days).
  // The expiry time for a session is reset every time a user revisits the site
  // or revalidates their session token - this is the maximum idle time value.
  sessionMaxAge = 60000 * 60 * 24 * 7,
  // Session Revalidation in X ms (optional, default is 60 seconds).
  // Specifies how often a Single Page App should revalidate a session.
  // Does not impact the session life on the server, but causes clients to 
  // refetch session info (even if it is in a local cache) after N seconds has
  // elapsed since it was last checked so they always display state correctly.
  // If set to 0 will revalidate a session before rendering every page.
  sessionRevalidateAge = 60000,
  // Canonical URL of the server (optional, but recommended).
  // e.g. 'http://localhost:3000' or 'https://www.example.com' 
  // Used in callbak URLs and email sign in links. It will be auto generated
  // if not specified, which may cause problems if your site uses multiple
  // aliases (e.g. 'example.com and 'www.examples.com').
  serverUrl = null,
  // If we are behind a proxy server and it says we are running SSL, trust it.
  // All this does is make sure we use HTTPS for callback URLs and email links.
  // You should never need to turn this off.
  trustProxy = true,
  // An array of oAuth Provider config blocks (optional).
  providers = [],
  // Port to start listening on
  port = null,
  // Functions for find, update, insert, serialize and deserialize methods.
  // They should all return a Promise with resolve() or reject().
  // find() should return resolve(null) if no matching user found.
  functions = {
    find: ({
      id,
      email,
      emailToken,
      provider // provider = { name: 'twitter', id: '123456' }
    } = {}) => { Promise.resolve(user) },
    update: (user, profile) => { Promise.resolve(user) },
    insert: (user, profile) => { Promise.resolve(user) },
    remove: (id) => { Promise.resolve(id) },
    serialize: (user) => { Promise.resolve(id) },
    deserialize: (id) => { Promise.resolve(user) },
    sendSignInEmail: ({
      email = null,
      url = null,
      req = null
    } = {}) => { Promise.resolve(true) }
  }
} = {}) => {
  
  if (typeof(functions) !== 'object') {
    throw new Error('functions must be a an object')
  }

  if (expressApp === null) {
    expressApp = Express()
  }

  // If an instance of nextApp was passed, let all requests to /_next/* pass
  // to it *before* Express Session and other middleware is called.
  if (nextApp) {
    expressApp.all('/_next/*', (req, res) => {
      let nextRequestHandler = nextApp.getRequestHandler()
      return nextRequestHandler(req, res)
    })
  }

  /**
   * Set up body parsing, express sessions and add CSRF tokens.
   *
   * You can set bodyParser to false and pass an Express instance if you want
   * to customise how you invoke Body Parser.
   */
  if (bodyParser === true) {
    expressApp.use(BodyParser.json())
    expressApp.use(BodyParser.urlencoded({
      extended: true
    }))
  }
  expressApp.use(expressSession({
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: 'auto',
      maxAge: sessionMaxAge
    }
  }))
  if (csrf === true) {
    expressApp.use(lusca.csrf())
  }
  if (trustProxy === true) {
    expressApp.set('trust proxy', 1)
  }

  /**
   * With sessions configured we need to configure Passport and trigger
   * passport.initialize() before we add any other routes.
   */
  passportStrategies({
    expressApp: expressApp,
    serverUrl: serverUrl,
    providers: providers,
    functions: functions
  })

  /**
   * Add route to get CSRF token via AJAX
   */
  expressApp.get(`${pathPrefix}/csrf`, (req, res) => {
    return res.json({
      csrfToken: res.locals._csrf
    })
  })

  /**
   * Return session info
   */
  expressApp.get(`${pathPrefix}/session`, (req, res) => {
    let session = {
      maxAge: sessionMaxAge,
      revalidateAge: sessionRevalidateAge,
      csrfToken: res.locals._csrf
    }

    // Add user object to session if logged in
    if (req.user) {
      // If logged in, export the API access token details to the client
      // Note: This token is valid for the duration of this session only.
      session.user = req.user
      if (req.session && req.session.api) {
        session.api = req.session.api
      }
    }

    return res.json(session)
  })
  
  /**
   * Return list of which accounts are already linked.
   * 
   * We define this both as a server side function and a RESTful endpoint so 
   * that it can be used rendering a page both server side and client side.
   */
  // Server side function
  expressApp.use((req, res, next) => {
    req.linked = () => {
      return new Promise((resolve, reject) => {
        if (!req.user) return resolve({})
          
        functions.serialize(req.user)
        .then(id => {
          if (!id) throw new Error("Unable to serialize user")
          return functions.find({ id: id })
        })
        .then(user => {
          if (!user) return resolve({})
        
          let linkedAccounts = {}
          providers.forEach(provider => {
            linkedAccounts[provider.providerName] = (user[provider.providerName.toLowerCase()]) ? true : false
          })
          
          return resolve(linkedAccounts)
        })
        .catch(err => {
          return reject(err)
        })  
      })
    }
    next()
  })
  // RESTful endpoint
  expressApp.get(`${pathPrefix}/linked`, (req, res) => {
    if (!req.user) return res.json({})

    // First get the User ID from the User, then look up the user details.
    // Note: We don't use the User object in req.user directly as it is a
    // a simplified set of properties set by functions.deserialize().
    functions.serialize(req.user)
    .then(id => {
      return functions.find({ id: id })
    })
    .then(user => {
      if (!user) return res.json({})
        
      let linkedAccounts = {}
      providers.forEach(provider => {
        linkedAccounts[provider.providerName] = (user[provider.providerName.toLowerCase()]) ? true : false
      })
      
      return res.json(linkedAccounts)
    })
    .catch(err => {
      return res.status(500).end()
    })
  })

  /**
   * Return list of configured oAuth Providers
   * 
   * We define this both as a server side function and a RESTful endpoint so 
   * that it can be used rendering a page both server side and client side.
   */
  // Server side function
  expressApp.use((req, res, next) => {
    req.providers = () => {
      return new Promise((resolve, reject) => {
        let configuredProviders = {}
        providers.forEach(provider => {
          configuredProviders[provider.providerName] = {
            signin: (serverUrl || '') + `${pathPrefix}/oauth/${provider.providerName.toLowerCase()}`,
            callback: (serverUrl || '') + `${pathPrefix}/oauth/${provider.providerName.toLowerCase()}/callback`
          }
        })
        return resolve(configuredProviders)
      })    
    }
    next()
  })
  // RESTful endpoint
  expressApp.get(`${pathPrefix}/providers`, (req, res) => {
    return new Promise((resolve, reject) => {
      let configuredProviders = {}
      providers.forEach(provider => {
        configuredProviders[provider.providerName] = {
          signin: (serverUrl || '') + `${pathPrefix}/oauth/${provider.providerName.toLowerCase()}`,
          callback: (serverUrl || '') + `${pathPrefix}/oauth/${provider.providerName.toLowerCase()}/callback`
        }
      })
      return res.json(configuredProviders)
    })
  })
  
  /**
   * Generate a one time use sign in link and email it to the user
   */
  expressApp.post(`${pathPrefix}/email/signin`, (req, res) => {
    const email = req.body.email || null
    
    if (!email || email.trim() === '') {
      res.redirect(`${pathPrefix}`)
    }

    const token = uuid()
    const url = (serverUrl || `${req.protocol}://${req.headers.host}`) + `${pathPrefix}/email/signin/${token}`

    // Create verification token save it to database
    functions.find({ email: email })
    .then(user => {
      if (user) {
        // If a user with that email address exists already, update token.
        user.emailToken = token
        return functions.update(user)
      } else {
        // If the user does not exist, create a new account with the token.
        return functions.insert({
          email: email,
          emailToken: token
        })
      }
    })
    .then(user => {
      functions.sendSignInEmail({
        email: user.email,
        url: url
      })
      return res.redirect(`${pathPrefix}/check-email?email=${email}`)
    })
    .catch(err => {
      return res.redirect(`${pathPrefix}/error?action=signin&type=email&email=${email}`)
    })
  })

  /**
   * Verify token in callback URL for email sign in 
   */
  expressApp.get(`${pathPrefix}/email/signin/:token`, (req, res) => {
    if (!req.params.token) {
      return res.redirect(`${pathPrefix}/error?action=signin&type=token-missing`)
    }

    functions.find({ emailToken: req.params.token })
    .then(user => {
      if (user) {
        // Delete current token so it cannot be used again
        delete user.emailToken
        // Mark email as verified now we know they have access to it
        user.emailVerified = true
        return functions.update(user)
      } else {
        return Promise.reject(new Error("Token not valid"))
      }
    })
    .then(user => {
      // If the user object is valid, sign the user in
      req.logIn(user, (err) => {
        if (err) throw err
        return res.redirect(`${pathPrefix}/callback?action=signin&service=email`)
      })
    })
    .catch(err => {
      return res.redirect(`${pathPrefix}/error?action=signin&type=token-invalid`)
    })
  })

  /**
   * Sign a user out
   */
  expressApp.post(`${pathPrefix}/signout`, (req, res) => {
    // Log user out with Passport and remove their Express session
    req.logout()
    req.session.destroy(() => {
      return res.redirect(`${pathPrefix}/callback?action=signout`)
    })
  })

  return new Promise((resolve, reject) => {
    let response = {
      next: nextApp,
      express: Express,
      expressApp: expressApp,
      functions: functions,
      providers: providers,
      port: port
    }
    
    // If no port specified, don't start Express automatically
    if (!port) return resolve(response)
    
    // If an instance of nextApp was passed, have it handle all other routes
    if (nextApp) {
      expressApp.all('*', (req, res) => {
        let nextRequestHandler = nextApp.getRequestHandler()
        return nextRequestHandler(req, res)
      })
    }
    
    // Start Express
    return expressApp.listen(port, err => {
      if (err) reject(err)
      return resolve(response)
    })
  })
}
