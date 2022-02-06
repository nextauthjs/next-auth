---
id: pages
title: Pages
---

NextAuth.js automatically creates simple, unbranded authentication pages for handling Sign in, Sign out, Email Verification and displaying error messages.

The options displayed on the sign up page are automatically generated based on the providers specified in the options passed to NextAuth.js.

To add a custom login page, you can use the `pages` option:

```javascript title="pages/api/auth/[...nextauth].js"
...
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: null // If set, new users will be directed here on first sign in
  }
...
```

## Error codes

We purposefully restrict the returned error codes for increased security.

### Error page

The following errors are passed as error query parameters to the default or overriden error page:

- **Configuration**: There is a problem with the server configuration. Check if your [options](/configuration/options#options) is correct.
- **AccessDenied**: Usually occurs, when you restricted access through the [`signIn` callback](/configuration/callbacks#sign-in-callback), or [`redirect` callback](/configuration/callbacks#redirect-callback)
- **Verification**: Related to the Email provider. The token has expired or has already been used
- **Default**: Catch all, will apply, if none of the above matched

Example: `/auth/error?error=Configuration`

### Sign-in page

The following errors are passed as error query parameters to the default or overriden sign-in page:

- **OAuthSignin**: Error in constructing an authorization URL ([1](https://github.com/nextauthjs/next-auth/blob/457952bb5abf08b09861b0e5da403080cd5525be/src/server/lib/signin/oauth.js), [2](https://github.com/nextauthjs/next-auth/blob/ead715219a5d7a6e882a6ba27fa56b03954d062d/src/server/lib/oauth/pkce-handler.js), [3](https://github.com/nextauthjs/next-auth/blob/ead715219a5d7a6e882a6ba27fa56b03954d062d/src/server/lib/oauth/state-handler.js)),
- **OAuthCallback**: Error in handling the response ([1](https://github.com/nextauthjs/next-auth/blob/ead715219a5d7a6e882a6ba27fa56b03954d062d/src/server/lib/oauth/callback.js), [2](https://github.com/nextauthjs/next-auth/blob/ead715219a5d7a6e882a6ba27fa56b03954d062d/src/server/lib/oauth/pkce-handler.js), [3](https://github.com/nextauthjs/next-auth/blob/ead715219a5d7a6e882a6ba27fa56b03954d062d/src/server/lib/oauth/state-handler.js)) from an OAuth provider.
- **OAuthCreateAccount**: Could not create OAuth provider user in the database.
- **EmailCreateAccount**: Could not create email provider user in the database.
- **Callback**: Error in the [OAuth callback handler route](https://github.com/nextauthjs/next-auth/blob/main/src/server/routes/callback.js)
- **OAuthAccountNotLinked**: If the email on the account is already linked, but not with this OAuth account
- **EmailSignin**: Sending the e-mail with the verification token failed
- **CredentialsSignin**: The `authorize` callback returned `null` in the [Credentials provider](/providers/credentials). We don't recommend providing information about which part of the credentials were wrong, as it might be abused by malicious hackers.
- **Default**: Catch all, will apply, if none of the above matched

Example: `/auth/error?error=Default`

## Theming

By default, the built-in pages will follow the system theme, utilizing the [`prefer-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) Media Query. You can override this to always use a dark or light theme, through the [`theme` option](/configuration/options#theme).

## Examples

### OAuth Sign in

In order to get the available authentication providers and the URLs to use for them, you can make a request to the API endpoint `/api/auth/providers`:

```jsx title="pages/auth/signin.js"
import { getProviders, signIn } from "next-auth/client"

export default function SignIn({ providers }) {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
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

### Email Sign in

If you create a custom sign in form for email sign in, you will need to submit both fields for the **email** address and **csrfToken** from **/api/auth/csrf** in a POST request to **/api/auth/signin/email**.

```jsx title="pages/auth/email-signin.js"
import { getCsrfToken } from "next-auth/client"

export default function SignIn({ csrfToken }) {
  return (
    <form method="post" action="/api/auth/signin/email">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label>
        Email address
        <input type="email" id="email" name="email" />
      </label>
      <button type="submit">Sign in with Email</button>
    </form>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken },
  }
}

/*
// If older than Next.js 9.3
SignIn.getInitialProps = async (context) => {
  return {
    csrfToken: await getCsrfToken(context)
  }
}
*/
```

You can also use the `signIn()` function which will handle obtaining the CSRF token for you:

```js
signIn("email", { email: "jsmith@example.com" })
```

### Credentials Sign in

If you create a sign in form for credentials based authentication, you will need to pass a **csrfToken** from **/api/auth/csrf** in a POST request to **/api/auth/callback/credentials**.

```jsx title="pages/auth/credentials-signin.js"
import { getCsrfToken } from "next-auth/client"

export default function SignIn({ csrfToken }) {
  return (
    <form method="post" action="/api/auth/callback/credentials">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label>
        Username
        <input name="username" type="text" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button type="submit">Sign in</button>
    </form>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}

/*
// If older than Next.js 9.3
SignIn.getInitialProps = async (context) => {
  return {
    csrfToken: await getCsrfToken(context)
  }
}
*/
```

You can also use the `signIn()` function which will handle obtaining the CSRF token for you:

```js
signIn("credentials", { username: "jsmith", password: "1234" })
```

:::tip
Remember to put any custom pages in a folder outside **/pages/api** which is reserved for API code. As per the examples above, a location convention suggestion is `pages/auth/...`.
:::
