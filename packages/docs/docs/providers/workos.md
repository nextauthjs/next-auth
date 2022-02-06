---
id: workos
title: WorkOS
---

## Documentation

https://workos.com/docs/sso/guide

## Configuration

https://dashboard.workos.com

## Options

The **WorkOS Provider** comes with a set of default options:

- [WorkOS Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/workos.js)

You can override any of the options to suit your own use case.

## Example

```js
import WorkOSProvider from "next-auth/providers/workos";
...
providers: [
  WorkOSProvider({
    clientId: process.env.WORKOS_CLIENT_ID,
    clientSecret: process.env.WORKOS_API_KEY,
  }),
],
...
```

WorkOS is not an identity provider itself, but, rather, a bridge to multiple single sign-on (SSO) providers. As a result, we need to make some additional changes to authenticate users using WorkOS.

In order to sign a user in using WorkOS, we need to specify which WorkOS Connection to use. A common way to do this is to collect the user's email address and extract the domain.

This can be done using a custom login page.

To add a custom login page, you can use the `pages` option:

```javascript title="pages/api/auth/[...nextauth].js"
...
  pages: {
    signIn: "/auth/signin",
  }
```

We can then add a custom login page that displays an input where the user can enter their email address. We then extract the domain from the user's email address and pass it to the `authorizationParams` parameter on the `signIn` function:

```jsx title="pages/auth/signin.js"
import { useState } from "react"
import { getProviders, signIn } from "next-auth/react"

export default function SignIn({ providers }) {
  const [email, setEmail] = useState("")

  return (
    <>
      {Object.values(providers).map((provider) => {
        if (provider.id === "workos") {
          return (
            <div key={provider.id}>
              <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
              />
              <button
                onClick={() =>
                  signIn(provider.id, undefined, {
                    domain: email.split("@")[1],
                  })
                }
              >
                Sign in with SSO
              </button>
            </div>
          )
        }

        return (
          <div key={provider.id}>
            <button onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          </div>
        )
      })}
    </>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}

/*
// If older than Next.js 9.3
SignIn.getInitialProps = async () => {
  return {
    providers: await getProviders()
  }
}
*/
```
