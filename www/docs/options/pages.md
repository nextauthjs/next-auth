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
    error: '/auth/error',
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: null // If set, new users will be directed here on first sign in
  }
  ...
```

## Sign in

In order to get the available providers and the URLs to use for them, you can make a request to the API endpoint `/api/auth/providers`:

```jsx title="/pages/auth/signin"
import React from 'react'
import { providers } from 'next-auth/client'

export default ({ providers }) => {
  return (
    <>
      {Object.values(providers).map(provider => (
        <p key={provider.name}>
          <a href={provider.signinUrl}>
            <Button type='submit' appearance='primary' block>Sign in with {provider.name}</Button>
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

:::note
This feature is complete but it is not yet documented.
:::

:::tip
If you create a custom sign in form for email sign in, you will need to submit both fields for the **email** address and **csrfToken** from **/api/auth/csrf** in a POST request to **/api/auth/signin/email**, or use the **signin()** method.
:::
