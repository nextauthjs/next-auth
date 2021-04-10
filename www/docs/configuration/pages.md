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

## Examples

### OAuth Sign in

In order to get the available authentication providers and the URLs to use for them, you can make a request to the API endpoint `/api/auth/providers`:

```jsx title="pages/auth/signin.js"
import { providers, signIn } from 'next-auth/client'

export default function SignIn({ providers }) {
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

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context){
  const providers = await providers()
  return {
    props: { providers }
  }
}

/*
// If older than Next.js 9.3
SignIn.getInitialProps = async () => {
  return {
    providers: await providers()
  }
}
*/
```

### Email Sign in

If you create a custom sign in form for email sign in, you will need to submit both fields for the **email** address and **csrfToken** from **/api/auth/csrf** in a POST request to **/api/auth/signin/email**.

```jsx title="pages/auth/email-signin.js"
import { getCsrfToken } from 'next-auth/client'

export default function SignIn({ csrfToken }) {
  return (
    <form method='post' action='/api/auth/signin/email'>
      <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
      <label>
        Email address
        <input type='email' id='email' name='email'/>
      </label>
      <button type='submit'>Sign in with Email</button>
    </form>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context){
  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken }
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
signIn('email', { email: 'jsmith@example.com' })
```

### Credentials Sign in

If you create a sign in form for credentials based authentication, you will need to pass a **csrfToken** from **/api/auth/csrf** in a POST request to **/api/auth/callback/credentials**.

```jsx title="pages/auth/credentials-signin.js"
import { getCsrfToken } from 'next-auth/client'

export default function SignIn({ csrfToken }) {
  return (
    <form method='post' action='/api/auth/callback/credentials'>
      <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
      <label>
        Username
        <input name='username' type='text'/>
      </label>
      <label>
        Password
        <input name='password' type='password'/>
      </label>
      <button type='submit'>Sign in</button>
    </form>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context)
    }
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
signIn('credentials', { username: 'jsmith', password: '1234' })
```

:::tip
Remember to put any custom pages in a folder outside **/pages/api** which is reserved for API code. As per the examples above, a location convention suggestion is `pages/auth/...`. 
:::
