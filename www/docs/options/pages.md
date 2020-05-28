---
id: pages
title: Pages
---


### Using custom pages

NextAuth.js automatically creates simple, unbranded authentication pages for handling Sign in, Email Verification, callbacks, etc. The options displayed are generated based on the configuration supplied.

To add a custom login page, for example. You can us the `pages` option:

```javascript title="/pages/api/auth/[...nextauth].js"
  ...
  pages: {
    signin: '/auth/signin',
    signout: '/auth/signout',
    checkEmail: '/auth/check-email',
    error: '/auth/error'
  }
  ...
```

In order to get the available providers, you can make a request to `/api/auth/providers`:

```jsx title="/pages/auth/signin"
import React from 'react'

const SignIn = ({ providers }) => {
  return (
    <div>
      {providers && Object.values(providers).map(provider => (
        <p key={provider.name}>
          <a href={provider.signinUrl}>
            <Button type='submit' appearance='primary' block>Sign in with {provider.name}</Button>
          </a>
        </p>
      ))}
    </div>
  )
}

export default SignIn

export async function getServerSideProps ({ req }) {
  const host = req ? req.headers['x-forwarded-host'] : window.location.hostname
  let protocol = 'https:'
  if (host.indexOf('localhost') > -1) {
    protocol = 'http:'
  }
  const res = await fetch(`${protocol}//${host}/api/auth/providers`)
  const providers = await res.json()

  return {
    props: {
      providers
    }
  }
}
```

:::note
The documentation for creating custom pages is in progress and will be expanded in future.
:::

:::note
Additional NextAuth.js client methods to handle signin, signout, csrftokens, returning a list of providers are in development and will make creating custom pages much easier.
:::

:::tip
If you create a custom sign in form for email sign in, you will need to submit both fields for the **email** address and **csrfToken** from **/api/auth/csrf** in a POST request to **/api/auth/signin/email**.
:::
