---
id: client-v1
title: Client
---

## About NextAuthClient

NextAuthClient is session library for the [next-auth](https://www.npmjs.com/package/next-auth) module.

## Methods

It provides the following methods, all of which return a promise.

### NextAuthClient.init({ req, force })

Isometric (can be used in server side rendering when passed optional `req` object).

Return the current session.

When using Server Side Rendering and passed `req` object from **getInitialProps({req})** it will read the data from it.

When using Client Side Rendering it will use localStorage (if avalible) to check for cached session data and if not found or expired it call the `/auth/session` end point.

### NextAuthClient.signin(string or object)

Client side only method.

If passed a string treats it as an email address, generates an email sign in token and makes POST request to `/auth/email/signin`.

If passed an object treats it as a form to be handled by a custom signIn() function and makes a POST request to `/auth/signin`.

### NextAuthClient.signout()

Client side only method. Triggers the current session to be destroyed.

Makes POST request to `/auth/signout`.

### NextAuthClient.csrfToken()

Client side only method. Returns the latest CSRF Token.

Note: When rendering server side, this is accessible from NextAuthClient.init().

Makes GET request to `/auth/csrf`.

### NextAuthClient.linked({ req })

Isometric method (can be used in server side rendering when passed optional `req` object).

Returns a list of linked/unlinked oAuth providers.

This is useful on account management pages where you want to display buttons to link / unlink accounts.

Makes GET request to `/auth/linked`.

### NextAuthClient.providers({ req })

Isometric method (can be used in server side rendering when passed optional `req` object).

Returns a list of all configured oAuth providers.

It includes their names, sign in URLs and callback URLs.

This is useful on sign in pages (e.g. to render sign in links for all configured providers).

Makes GET request to `/auth/providers`.

## Example

````javascript
import React from 'react'
import { NextAuth } from 'next-auth/client'

export default class extends React.Component {
  static async getInitialProps({req}) {
    return {
      session: await NextAuth.init({req})
    }
  }
  render() {
    if (this.props.session.user) {
      return(
        <div>
          <p>You are logged in as {this.props.session.user.name || this.props.session.user.email}.</p>
        </div>
        )
    } else {
      return(
        <div>
          <p>You are not logged in.</p>
        </div>
      )
    }
  }
}
````

See [next-auth](https://www.npmjs.com/package/next-auth) for more information or [nextjs-starter](https://nextjs-starter.now.sh) for a working demo.
