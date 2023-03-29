---
title: Callbacks
---

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

Callbacks are **asynchronous** functions you can use to control what happens when an action is performed.

Callbacks are extremely powerful, especially in scenarios involving JSON Web Tokens as they allow you to implement access controls without a database and to integrate with external databases or APIs.

:::tip
If you want to pass data such as an Access Token or User ID to the browser when using JSON Web Tokens, you can persist the data in the token when the `jwt` callback is called, then pass the data through to the browser in the `session` callback.
:::

You can specify a handler for any of the callbacks below.

<Tabs>
  <TabItem value="typescript" label="typescript">

```js title="pages/api/auth/[...nextauth].ts"s
  import { User, Account, Profile, Session } from "next-auth";
  import { AdapterUser } from "next-auth/adapters";
  import { CredentialInput } from "next-auth/providers";
  import { JWT } from "next-auth/jwt";

  callbacks: {
    async signIn(props: {
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile;
      email?: {
        verificationRequest?: boolean;
      };
      credentials?: Record<string, CredentialInput>;
    }) {
      const {user, account, profile, email, credentials} = props
      return true;
    },

    async redirect(params: { url: string, baseUrl: string }) {
      const { url, baseUrl } = params;
      return baseUrl;
    },

    async session(params: {
      session: Session;
      user: User | AdapterUser;
      token: JWT;
    }) {
      const { session, user, token } = params;
      return session;
    },

    async jwt(params: {
      token: JWT;
      user?: User | AdapterUser;
      account?: Account | null;
      profile?: Profile;
      isNewUser?: boolean;
    }) {
      const { token, user, account, profile, isNewUser } = params;
      return token;
    }
  }
```

  </TabItem>
  <TabItem value="javascript" label="javascript">

```js title="pages/api/auth/[...nextauth].js"s
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, user, token }) {
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token
    }
  }
```

  </TabItem>
</Tabs>

The documentation below shows how to implement each callback, their default behavior and an example of what the response for each callback should be. Note that configuration options and authentication providers you are using can impact the values passed to the callbacks.

## Sign in callback

Use the `signIn()` callback to control if a user is allowed to sign in.

<Tabs>
  <TabItem value="typescript" label="typescript">

```js title="pages/api/auth/[...nextauth].ts"
import { User, Account, Profile, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { CredentialInput } from "next-auth/providers";
import { JWT } from "next-auth/jwt";

callbacks: {
  async signIn(props: {
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile;
      email?: {
        verificationRequest?: boolean;
      };
      credentials?: Record<string, CredentialInput>;
    }) {
      const {user, account, profile, email, credentials} = props
      const isAllowedToSignIn = true
      if (isAllowedToSignIn) {
        return true
    } else {
      // Return false to display a default error message
        return false
      // Or you can return a URL to redirect to:
      // return '/unauthorized'
    }
  }
}
```

</TabItem>
<TabItem value="javascript" label="javascript">

```js title="pages/api/auth/[...nextauth].js"
callbacks: {
  async signIn({ user, account, profile, email, credentials }) {
    const isAllowedToSignIn = true
    if (isAllowedToSignIn) {
      return true
    } else {
      // Return false to display a default error message
      return false
      // Or you can return a URL to redirect to:
      // return '/unauthorized'
    }
  }
}
```

  </TabItem>
</Tabs>

- When using the **Email Provider** the `signIn()` callback is triggered both when the user makes a **Verification Request** (before they are sent an email with a link that will allow them to sign in) and again _after_ they activate the link in the sign-in email.

  Email accounts do not have profiles in the same way OAuth accounts do. On the first call during email sign in the `email` object will include a property `verificationRequest: true` to indicate it is being triggered in the verification request flow. When the callback is invoked _after_ a user has clicked on a sign-in link, this property will not be present.

  You can check for the `verificationRequest` property to avoid sending emails to addresses or domains on a blocklist (or to only explicitly generate them for email address in an allow list).

* When using the **Credentials Provider** the `user` object is the response returned from the `authorize` callback and the `profile` object is the raw body of the `HTTP POST` submission.

:::note
When using Auth.js with a database, the User object will be either a user object from the database (including the User ID) if the user has signed in before or a simpler prototype user object (i.e. name, email, image) for users who have not signed in before.

When using Auth.js without a database, the user object will always be a prototype user object, with information extracted from the profile.
:::

:::note
Redirects returned by this callback cancel the authentication flow. Only redirect to error pages that, for example, tell the user why they're not allowed to sign in.

To redirect to a page after a successful sign in, please use [the `callbackUrl` option](/reference/utilities/#specifying-a-callbackurl) or [the redirect callback](/reference/configuration/auth-config#callbacks).
:::

## Redirect callback

The redirect callback is called anytime the user is redirected to a callback URL (e.g. on sign in or sign out).

By default only URLs on the same URL as the site are allowed, you can use the redirect callback to customize that behavior.

The default redirect callback looks like this:

<Tabs>
  <TabItem value="typescript" label="typescript">

```js title="pages/api/auth/[...nextauth].ts"
callbacks: {
 async redirect(params: { url: string, baseUrl: string }) {
      const { url, baseUrl } = params;
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
  }
}
```

  </TabItem>
  <TabItem value="javascript" label="javascript">

```js title="pages/api/auth/[...nextauth].js"
callbacks: {
  async redirect({ url, baseUrl }) {
    // Allows relative callback URLs
    if (url.startsWith("/")) return `${baseUrl}${url}`
    // Allows callback URLs on the same origin
    else if (new URL(url).origin === baseUrl) return url
    return baseUrl
  }
}
```

  </TabItem>
</Tabs>

:::note
The redirect callback may be invoked more than once in the same flow.
:::

## JWT callback

This callback is called whenever a JSON Web Token is created (i.e. at sign
in) or updated (i.e whenever a session is accessed in the client). The returned value will be [encrypted](/reference/configuration/auth-config#jwt), and it is stored in a cookie.

Requests to `/api/auth/signin`, `/api/auth/session` and calls to `getSession()`, `unstable_getServerSession()`, `useSession()` will invoke this function, but only if you are using a [JWT session](/reference/configuration/auth-config#session). This method is not invoked when you persist sessions in a database.

- As with database persisted session expiry times, token expiry time is extended whenever a session is active.
- The arguments _user_, _account_, _profile_ and _isNewUser_ are only passed the first time this callback is called on a new session, after the user signs in. In subsequent calls, only `token` will be available.

The contents _user_, _account_, _profile_ and _isNewUser_ will vary depending on the provider and on if you are using a database or not. You can persist data such as User ID, OAuth Access Token in this token. To make it available in the browser, check out the [`session()` callback](#session-callback) as well.

<Tabs>
  <TabItem value="typescript" label="typescript">

```js title="pages/api/auth/[...nextauth].ts"
import { Account } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

callbacks: {
  async jwt(params: {
      token: JWT & { accessToken?: string };
      account?: Account | null;
    }) {
      const { token, account } = params;
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
  }
}
```

  </TabItem>
   <TabItem value="javascript" label="javascript">

```js title="pages/api/auth/[...nextauth].js"
callbacks: {
  async jwt({ token, account }) {
    // Persist the OAuth access_token to the token right after signin
    if (account) {
      token.accessToken = account.access_token
    }
    return token
  }
}
```

  </TabItem>
</Tabs>

:::tip
Use an if branch to check for the existence of parameters (apart from `token`). If they exist, this means that the callback is being invoked for the first time (i.e. the user is being signed in). This is a good place to persist additional data like an `access_token` in the JWT. Subsequent invocations will only contain the `token` parameter.
:::

## Session callback

The session callback is called whenever a session is checked. By default, only a subset of the token is returned for increased security. If you want to make something available you added to the token through the `jwt()` callback, you have to explicitly forward it here to make it available to the client.

e.g. `getSession()`, `useSession()`, `/api/auth/session`

- When using database sessions, the User object is passed as an argument.
- When using JSON Web Tokens for sessions, the JWT payload is provided instead.

<Tabs>
  <TabItem value="typescript" label="typescript">

```js title="pages/api/auth/[...nextauth].ts"
import { User, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

callbacks: {
  async session(params: {
      session: Session & { accessToken?: string };
      user: User | AdapterUser;
      token: JWT & { accessToken?: string };
    }) {
      const { session, user, token } = params;
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      return session
  }
}
```

  </TabItem>
  <TabItem value="javascript" label="javascript">

```js title="pages/api/auth/[...nextauth].js"
callbacks: {
  async session({ session, token, user }) {
    // Send properties to the client, like an access_token from a provider.
    session.accessToken = token.accessToken
    return session
  }
}
```

   </TabItem>
</Tabs>

:::tip
When using JSON Web Tokens the `jwt()` callback is invoked before the `session()` callback, so anything you add to the
JSON Web Token will be immediately available in the session callback, like for example an `access_token` from a provider.
:::

:::warning
The session object is not persisted server side, even when using database sessions - only data such as the session token, the user, and the expiry time is stored in the session table.

If you need to persist session data server side, you can use the `accessToken` returned for the session as a key - and connect to the database in the `session()` callback to access it. Session `accessToken` values do not rotate and are valid as long as the session is valid.

If using JSON Web Tokens instead of database sessions, you should use the User ID or a unique key stored in the token (you will need to generate a key for this yourself on sign in, as access tokens for sessions are not generated when using JSON Web Tokens).
:::
