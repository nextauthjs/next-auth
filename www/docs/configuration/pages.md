---
id: pages
title: Custom Pages
---

NextAuth.js automatically creates simple, unbranded authentication pages for handling Sign in, Sign out, Email Verification and displaying error messages.

The options displayed on the sign up page are automatically generated based on the providers specified in the options passed to NextAuth.js.

## Using custom pages

To add a custom login page, for example. You can us the `pages` option:

```javascript title="/pages/api/auth/[...nextauth].js"
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

## Sign in

### OAuth sign in page

In order to get the available authentication providers and the URLs to use for them, you can make a request to the API endpoint `/api/auth/providers`:

```jsx title="/pages/auth/signin"
import React from 'react'
import { providers, signin } from 'next-auth/client'

export default ({ providers }) => {
  return (
    <>
      {Object.values(providers).map(provider => (
        <p key={provider.name}>
          <a href={provider.signinUrl} onClick={(e) => e.preventDefault()}>
            <button onClick={() => signin(provider.id)}>Sign in with {provider.name}</button>
          </a>
        </p>
      ))}
    </>
  )
}

export async function getServerSideProps (context) {
  return {
    props: {
      providers: await providers(context)
    }
  }
}
```

:::tip
The **signin()** method automatically sets the callback URL to the current page. Using a link as a fallback means it sign in can work even without client side JavaScript.
:::

### Email sign in page

If you create a custom sign in form for email sign in, you will need to submit both fields for the **email** address and **csrfToken** from **/api/auth/csrf** in a POST request to **/api/auth/signin/email**.

This is easier of if you use the build in `signin()` function, as it sets the CSRF automatically.

:::tip
To create a sign in page that works on clients with and without client side JavaScript, you can use both the **signin()** method and the **csrfToken()** method
:::

```jsx title="/pages/auth/email-signin"
import React from 'react'
import { csrfToken, signin } from 'next-auth/client'

export default ({ csrfToken }) => {
  return (
    <form
      method='post'
      action='/api/auth/signin/email'
      onSubmit={(e) => {
        e.preventDefault()
        signin('email', { email: document.getElementById('email').value })
      }}
    >
      <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
      <label>
        Email address
        <input type='text' id='email' name='email'/>
      </label>
      <button type='submit'>Sign in with Email</button>
    </form>
  )
}

export async function getServerSideProps (context) {
  return {
    props: {
      csrfToken: await csrfToken(context)
    }
  }
}
```
