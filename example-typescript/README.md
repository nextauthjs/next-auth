# NextAuth Example

## About NextAuth Example

This is an example of how to use the [NextAuth](https://www.npmjs.com/package/next-auth) module.

## Getting Started

This project as is run the same way as any Next.js project.

To run it locally, just use:

    npm run dev

To run it it production mode, use:

    npm build
    npm start

## Using NextAuth

NextAuth is included in this project here:

* index.js

## Pages

This example includes the following pages:

* pages/index.js
* pages/auth/index.js
* pages/auth/error.js
* pages/auth/check-email.js
* pages/auth/callback.js

The file `pages/auth/credentials.js` provides an additional example of how to use a custom authentication handler defined in `next-auth.functions.js`.

## Configuration

It also includes the following configuration files:

* next-auth.config.js
* next-auth.functions.js
* next-auth.providers.js

An example **.env** file is provided in **.env.example** which you can copy over to use for simple configuration:

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

If you don't specify a MONGO_URI it will use an in-memory data store for user and session data.

If you don't specify oAuth or SMTP email details you will not be able to log in.

For a more complete example with live demo see [nextjs-starter.now.sh](https://nextjs-starter.now.sh/examples/authentication).
