# NextAuthClient

## About NextAuthClient

NextAuthClient is session library for the [next-auth](https://www.npmjs.com/package/next-auth) module.

## Methods

It provides the following methods, all of which return a promise:

### NextAuthClient.init({ req, force })

Isometric (runs client and server side). Return the current session.

When using Server Side Rendering and passed `req` object from **getInitialProps({req})** it will read the data from it.

When using Client Side Rendering it will use localStorage (if avalible) to check for cached session data and if not found or expired it call the `/auth/session` end point.

### NextAuthClient.signin({ email })

Client side only method. Request an email sign in token.

### NextAuthClient.signout()

Client side only method. Triggers the current session to be destroyed.

### NextAuthClient.csrfToken()

Client side only method. Returns the latest CSRF Token.

Note: When rendering server side, this is accessible from NextAuthClient.init().

### NextAuthClient.linked()

Client side only method. Returns a list of linked/unlinked oAuth providers.

This is useful on account management pages where you want to display buttons to link / unlink accounts.

### NextAuthClient.providers()

Client side only method. Returns a list of all configured oAuth providers.

It includes their names, sign in URLs and callback URLs. This is useful on sign in pages and to check the callback URLs when configuring oAuth providers.

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