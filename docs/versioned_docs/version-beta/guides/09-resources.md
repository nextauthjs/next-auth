---
title: Community resources
---

The community around NextAuth has created a ton of tutorials on how to use it in different scenarios and using different configurations. Here is a list of some of them in case it's helpful.

:::info
If you did not find a guide or tutorial covering your use case, please [open an issue](https://github.com/nextauthjs/next-auth/issues/new?assignees=&labels=triage%2Cdocumentation&template=4_documentation.yml) and let us know so that we can make an official guide for it and spread the knowledge!
:::

### Basic of NextAuth

- [Securing pages and API routes](/tutorials/securing-pages-and-api-routes)
  - How to restrict access to pages and API routes.
- [Usage with class components](/tutorials/usage-with-class-components)
  - How to use `useSession()` hook with class components.
- [Next.js Authentication with Okta and NextAuth.js 4.0](https://thetombomb.com/posts/nextjs-nextauth-okta)
  - Learn how to perform authentication with an OIDC Application in Okta and NextAuth.js.

  

### Advanced

- [Refresh Token Rotation](/tutorials/refresh-token-rotation)
  - How to implement refresh token rotation.
- [LDAP Authentication](/tutorials/ldap-auth-example)
  - How to use the Credentials Provider to authenticate against an LDAP database. This approach can be used to authenticate existing user accounts against any backend.
- [Adding HTTP(S) Proxy Support](/tutorials/corporate-proxy)
  - Add support for HTTP/HTTPS Proxy support to `openid-client` in order to use NextAuth.js behind a corporate proxy or other locked down network.
- [Using the Email Provider behind Corporate Email Scanning Services](/tutorials/avoid-corporate-link-checking-email-provider)
  - An internal tutorial on modifying the catch-all API Route to gracefully handle `HEAD` requests.

### Adapters

- [Custom models with TypeORM](/adapters/typeorm#custom-models)
  - How to use models with custom properties using the TypeORM adapter.
- [Creating a database adapter](/tutorials/creating-a-database-adapter)
  - How to create a custom adapter, to use any database to fetch and store user / account data.
- [Adding role based login to database session strategy](/tutorials/role-based-login-strategy)
  - Implement a role based login system by adding a custom session callback.

### Testing 

- [Testing with Cypress](/tutorials/testing-with-cypress)
  - How to write tests using Cypress.