---
id: advanced-options
title: Advanced Options
---

Advanced options are passed the same way as basic options, but have more complex behaviour or potentially complex implications if they are used.

Most advanced options are not recommended, not supported and may change in future releases.

## Options

### basePath

* **Default value**: `/api/auth`
* **Required**: *No*

#### Description

This option allows you to specify a different base path if you don't want to use `/api/auth` for some reason.

If you set this option you **must** also specify the same value in the `NEXTAUTH_BASE_PATH` environment variable in `next.config.js` so that the client knows how to contact the server:

```js
module.exports = {
  env: {
    NEXTAUTH_BASE_PATH: '/api/my-custom-auth-route',
  },
}
```

This is required because the NextAuth.js API route is a seperate codepath to the NextAuth.js Client. As long as you specify this option in an environment variable, the client will be able to pick up any subsequent configuration from the server.

---

### callbackUrlHandler

* **Default value**: `function`
* **Required**: *No*

#### Description

To ensure site security, byt default `callbackUrlHandler` only allows callbackUrls for signup and signout to be at the same site as the one being signed into.

e.g. if the sign in URL was `https://example.com/api/auth/signin`:

* ✅ `https://example.com/path/to/page`
* ❌ `http://example.com/path/to/page` 
* ❌ `https://subdomain.example.com/path/to/page` 
* ❌ `https://example.com:8080/path/to/page`

If the URL is not allowed, the callback URL will be set to whatever the `site` option is (e.g.`https://example.com/`)

```js
const callbackUrlHandler = async (url, options) => {
  if (url.startsWith(options.site)) {
    return Promise.resolve(url)
  } else {
    return Promise.resolve(options.site)
  }
}
```

If you want to support signing in to sites across other domains, you can pass your own function to `callbackUrlHandler` to customise this behaviour.

---

### adapter

* **Default value**: *Adapater.Default()*
* **Required**: *No*

#### Description

A custom provider is an advanced option to use only if you need to use NextAuth.js with a database configuration that is not supported by the default `database` option.

See the [adapter documentation](/options/adapter) for more information.

:::note
If the `adapter` option is specified it overrides the `database` option.
:::

:::info
This option is not yet well documented. We are not currently able to provide support for this option. In future the goal is to provide first party and third party adapters to integrate with a wide range of platforms.
:::

---

### useSecureCookies

* **Default value**: `true` for HTTPS sites / `false` for HTTP sites
* **Required**: *No*

#### Description

When set to `true` (the default for all site URLs that start with `https://`) then all cookies set by NextAuth.js will only be accessible from HTTPS URLs.

This option defaults to `false` on URLs that start with `http://` (e.g. `http://localhost:3000`) for developer convenience.

You can manually set this option to `false` to disable this security feature and allow cookies to be acessible from non-secured URLs (this is not recommended).

:::note
Properties on any custom `cookies` that are specified override this option.
:::

:::warning
Setting this option to *false* in production is a security risk and may allow sessions to hijacked.
:::

---

### cookies

* **Default value**: `{}`
* **Required**: *No*

#### Description

You can override the default cookie names and options for any of the cookies used by NextAuth.js.

This is an advanced option and using it is not recommended.

You can specify one or more cookies with custom properties, but if you specify custom options for a cookie you must provided all the options for it. You will also likely want to create condtional behaviour to support local development (e.g. setting `secure: false` and not using cookie prefixes on localhost URLs).

**For example:**

```js
cookies: {
  sessionToken: {
    name: `__Secure-next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: true
    }
  },
  callbackUrl: {
    name: `__Secure-next-auth.callback-url`,
    options: {
      sameSite: 'lax',
      path: '/',
      secure: true
    }
  },
  baseUrl: {
    name: `__Secure-next-auth.base-url`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: true
    }
  },
  csrfToken: {
    name: `__Host-next-auth.csrf-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: true
    }
  }
}
```

:::warning
Changing the cookie options may introduce security flaws into your application and may break NextAuth.js integration now or in a future update. Using this option is not currently recommended.
:::