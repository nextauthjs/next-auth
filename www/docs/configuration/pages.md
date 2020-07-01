---
id: pages
title: Pages
---

NextAuth.js automatically creates simple, unbranded authentication pages for handling Sign in, Sign out, Email Verification and displaying error messages.

The options displayed on the sign up page are automatically generated based on the providers specified in the options passed to NextAuth.js.

### Configuration

To add a custom login page, for example. You can use the `pages` option:

```javascript title="pages/api/auth/[...nextauth].js"
  ...
  pages: {
    signin: '/auth/signin',
    signout: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: null // If set, new users will be directed here on first sign in
  }
  ...
```

## Examples

### OAuth Sign in

In order to get the available authentication providers and the URLs to use for them, you can make a request to the API endpoint `/api/auth/providers`:

```jsx title="pages/auth/signin"
import React from 'react'
import { providers, signIn } from 'next-auth/client'

export default ({ providers }) => {
  return (
    <>
      {Object.values(providers).map(provider => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>Sign in with {provider.name}</button>
        </div>
      ))}
    </>
  )
}

export async function getInitalProps(context) {
  return {
    providers: await providers(context)
  }
}
```

### Email Sign in

If you create a custom sign in form for email sign in, you will need to submit both fields for the **email** address and **csrfToken** from **/api/auth/csrf** in a POST request to **/api/auth/signin/email**.

```jsx title="pages/auth/email-signin"
import React from 'react'
import { csrfToken } from 'next-auth/client'

export default ({ csrfToken }) => {
  return (
    <form method='post' action='/api/auth/signin/email'>
      <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
      <label>
        Email address
        <input type='text' id='email' name='email'/>
      </label>
      <button type='submit'>Sign in with Email</button>
    </form>
  )
}

export async function getInitalProps(context) {
  return {
    csrfToken: await csrfToken(context)
  }
}
```

You can also use the `signIn()` function which will handle obtaining the CSRF token for you:

```js
signIn('email', { email: 'jsmith@example.com' })
```

### Credentials Sign in

If you create a sign in form for credentials based authenticaiton, you will needt to pass a **csrfToken** from **/api/auth/csrf** in a POST request to **/api/auth/callback/credentials**.

```jsx title="pages/auth/credentials-signin"
import React from 'react'
import { csrfToken } from 'next-auth/client'

export default ({ csrfToken }) => {
  return (
    <form method='post' action='/api/auth/callback/credentials'>
      <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
      <label>
        Username
        <input name='username' type='text'/>
      </label>
      <label>
        Password
        <input name='password' type='text'/>
      </label>
      <button type='submit'>Sign in</button>
    </form>
  )
}

export async function getInitalProps(context) {
  return {
    csrfToken: await csrfToken(context)
  }
}
```

You can also use the `signIn()` function which will handle obtaining the CSRF token for you:

```js
signIn('credentials', { username: 'jsmith', password: '1234' })
```