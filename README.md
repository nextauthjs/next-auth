# NextAuth

NextAuth is an authenticaton library for Next.js projects.

It contains an [example site](https://github.com/iaincollins/next-auth/tree/master/example) that shows how to use it in a simple project.

It's also used in the [nextjs-starter.now.sh](https://nextjs-starter.now.sh) project, which provides a more complete example.

## Example usage

If you have an existing Next.js site, create an `index.js` file in the root of your project containing the following:

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

Then copy over the example configuration files below (`next-auth.config.js`, `next-auth.functions.js` and `next-auth.providers.js`) into your project.

Add the following to your `package.json` file to start the project:

````json
"scripts": {
  "dev": "NODE_ENV=development node index.js",
  "build": "next build",
  "start": "node index.js"
},
````

You can add a `.env file to the root of the project as a place to specify configuration options:

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

See [AUTHENTICATION.md](https://github.com/iaincollins/next-auth/tree/master/AUTHENTICATION.md) for a guide on how to set up oAuth providers.

## Configuration

NextAuth configuration can be split into into three files, which makes it easier to manage.

### next-auth.config.js

Basic configuration is defined in **next-auth.config.js**

It also where **next-auth.functions.js** and **next-auth.providers.js** are loaded.

### next-auth.functions.js

CRUD methods for user management and sending email are defined in **next-auth.functions.js**

* find({id,email,emailToken,provider}) // Get user
* insert(user) // Create user
* update(user) // Update user
* remove(id) // Remove user
* serialize(user) // Get ID from user
* deserialize(id) // Get user from ID
* sendSigninEmail({email, url}) // Send email

The example configuration is designed to work with Mongo DB, but by defining the behaviour in these functions you can use NextAuth with any database, including a relational database that uses SQL.

### next-auth.providers.js 

Configuration for oAuth providers are defined in **next-auth.functions.js**

The example configuration file supports Facebook, Google and Twitter but can be updated to support any oAuth provider.

---- 

See the [nextjs-starter.now.sh](https://nextjs-starter.now.sh) project for more complete example and live demo.
