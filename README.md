# NextAuth

## About NextAuth

NextAuth is an authentication library for Next.js projects.

The NextAuth library uses Express and Passport, the most commonly used authentication library for Node.js, to provide support for signing in with email and with services like Facebook, Google and Twitter.

NextAuth adds Cross Site Request Forgery (CSRF) tokens and HTTP Only cookies, supports universal rendering and does not require client side JavaScript.

It adds session support without using client side accessible session tokens, providing protection against Cross Site Scripting (XSS) and session hijacking, while leveraging localStorage where available to cache non-critical session state for optimal performance in Single Page Apps.

The NextAuthClient library for NextAuth is designed to work with React pages powered by Next.js.

It contains an [example site](https://github.com/iaincollins/next-auth/tree/master/example) that shows how to use it in a simple project. It's also used in the [nextjs-starter.now.sh](https://nextjs-starter.now.sh) project, which provides a more complete example with a live demo.

## Routes

NextAuth adds a number of routes under `/auth':

* POST `/auth/email/signin` - Request Sign In Token
* GET `/auth/email/signin/:token` - Validate Sign In Token
* POST `/auth/signout` - Sign Out
* GET `/auth/csrf` - CSRF endpoint for Single Page Apps
* GET `/auth/session` - Session endpoint for Single Page Apps
* GET `/auth/linked` - View linked accounts for Single Page Apps

All POST routes request must include a CSRF token.

CSRF, Session and Linked Account endpoints are provided for Single Page Apps.

Note: Session Tokens are stored in HTTP Only cookies to prevent session hijacking and protect against Cross Site Scripting (XSS) attacks. Only HTTP requests that originate from the original domain are able to read from them.

In addition, it will add the following routes for each oAuth provider currently configured:

* GET `/auth/oauth/${provider}`
* GET `/auth/oauth/${provider}/callback`
* POST `/auth/oauth/${provider}/unlink`

You can see which routes are configured and the callback URLs defined for them via this route:

* GET `/auth/providers`

It will return a JSON object with the current oAuth provider configuration:

````json
{
  "Facebook": {
    "signin": "/auth/oauth/facebook",
    "callback": "/auth/oauth/facebook/callback"
  },
  "Google": {
    "signin": "/auth/oauth/google",
    "callback": "/auth/oauth/google/callback"
  },
  "Twitter": {
    "signin": "/auth/oauth/twitter",
    "callback": "/auth/oauth/twitter/callback"
  }
}
````

Note: The `/auth` prefix is configurable on the server, but it is currently hard coded in [the client](https://www.npmjs.com/package/next-auth-client), so you probably don't want to change it.

## Getting Started

Create an `index.js` file in the root of your Next.js project containing the following:

````javascript
// Include Next.js, Next Auth and a Next Auth config
const next = require('next')
const nextAuth = require('next-auth')
const nextAuthConfig = require('./next-auth.config')

// Load environment variables from .env
require('dotenv').load()

// Initialize Next.js
const nextApp = next({
  dir: '.',
  dev: (process.env.NODE_ENV === 'development')
})

// Add next-auth to next app
nextApp
.prepare()
.then(() => {
  // Load configuration and return config object
  return nextAuthConfig()
})
.then(nextAuthOptions => {
  // Pass Next.js App instance and NextAuth options to NextAuth
  return nextAuth(nextApp, nextAuthOptions)  
})
.then((response) => {
  console.log(`Ready on http://localhost:${process.env.PORT || 3000}`)
})
.catch(err => {
  console.log('An error occurred, unable to start the server')
  console.log(err)
})
````

You can add the following to your `package.json` file to start the project:

````json
"scripts": {
  "dev": "NODE_ENV=development node index.js",
  "build": "next build",
  "start": "node index.js"
}
````

## Pages

You will need to create following pages under `./pages/auth` in your project:

* index.js // Sign In
* error.js // Error handling
* check-email.js // Check email prompt
* callback.js // Callback page for Single Page Apps

You can [find examples of these](https://github.com/iaincollins/next-auth/tree/master/example) included which you can copy and paste into your project.

## Configuration

Configuration can be split across three files to make it easier to understand and manage.

You can copy over the following configuration files into the root of your project to get started:

* [next-auth.config.js](https://github.com/iaincollins/next-auth/tree/master/example/next-auth.config.js)
* [next-auth.functions.js](https://github.com/iaincollins/next-auth/tree/master/example/next-auth.functions.js)
* [next-auth.providers.js](https://github.com/iaincollins/next-auth/tree/master/example/next-auth.providers.js)


You can also add a **.env** file to the root of the project as a place to specify configuration options. The provided example files for NextAuth will use one if there is is one.

````
SERVER_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/my-database
FACEBOOK_ID=
FACEBOOK_SECRET=
GOOGLE_ID=
GOOGLE_SECRET=
TWITTER_KEY=
TWITTER_SECRET=
EMAIL_FROM=username@gmail.com
EMAIL_SERVER=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USERNAME=username@gmail.com
EMAIL_PASSWORD=
````

### next-auth.config.js

Basic configuration of NextAuth is handled in **next-auth.config.js**.

It is where the **next-auth.functions.js** and **next-auth.providers.js** files are loaded.

### next-auth.functions.js

Methods for user management and sending email are defined in **next-auth.functions.js**

* find({id,email,emailToken,provider})
* insert(user)
* update(user)
* remove(id)
* serialize(user)
* deserialize(id)
* sendSigninEmail({email, url})

The example configuration provided is for Mongo DB. By defining the behaviour in these functions you can use NextAuth with any database, including a relational database that uses SQL.

### next-auth.providers.js 

Configuration for oAuth providers are defined in **next-auth.functions.js**

It includes configuration examples for Facebook, Google and Twitter oAuth, which can easily be copied and replicated to add support for signing in other oAuth providers.

For tips on configuring oAuth see [AUTHENTICATION.md](https://github.com/iaincollins/next-auth/tree/master/AUTHENTICATION.md).

---- 

See the included [example site](https://github.com/iaincollins/next-auth/tree/master/example) and the expanded example at [nextjs-starter.now.sh](https://nextjs-starter.now.sh/examples/authentication).