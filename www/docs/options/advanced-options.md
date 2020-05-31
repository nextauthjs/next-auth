---
id: advanced-options
title: Advanced Options
---

Advanced options are passed the same way as basic options, but have more complex behaviour or potentially complex implications if they are used.

Most advanced options are not recommended, not supported and may change in future releases.

## Options

### pages

* **Default value**: `{}`
* **Required**: *No*

#### Description

Specify URLs to be used for custom sign in, sign out and error pages.

Any options specified will override the corresponding page.

*For example:*

```js
pages: {
  signin: '/auth/signin',
  signout: '/auth/signout',
  checkEmail: '/auth/check-email',
  error: '/auth/error'
}
```

See the documentation for the [pages option](/options/pages) for more information.

:::info
This API for this feature is fully working but is not yet well supported or comprehensively documented and it may require some trial and error to get everthing working if you use this option.
:::

---

### basePath

* **Default value**: `/api/auth`
* **Required**: *No*

#### Description

This option allows you to specify a different base path (other than `/api/auth` for authentication routes.

This option is not currently recommended as it is supported in the server but not fully supported in the client.

:::warning
This option is not supported by the NextAuth.js client, which currently assumes the default base path for all calls. If you use this option, you will not be able to use the NextAuth.js client in React components.
:::

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