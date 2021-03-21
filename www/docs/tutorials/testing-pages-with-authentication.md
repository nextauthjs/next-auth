---
id: testing-pages-with-authentication
title: Testing pages with authentication
---

NOTE: This approach requires that you are using [a database](/configuration/databases.md) and are not using JWT.

You may want to functionally test pages of your application that require authentication. In order to circumvent a login with a real authentication provider, you can create a session in the database and set a cookie inside your browser to use that session.

## Create a session 
Add a record to the `Sessions`-table, and make sure that the userId exists. A good place to do this is in your [database seed script](https://www.prisma.io/docs/guides/application-lifecycle/seed-database).

Example with [prisma](schemas/adapters#prisma-adapter):
```js
  const session = await prisma.session.create({
    data: {
      userId: 1,
      expires: "2099-04-20T02:04:17.216Z",
      sessionToken: "testSessionToken",
      accessToken: "testAccessToken",
    },
  });
```
## Set a cookie
Use the sessionToken from the previous step to set a cookie called `next-auth.session-token`. Make sure to adjust the values to fit your use case.

Example in [Cypress](https://cypress.io)
```js
cy.setCookie("next-auth.session-token","testSessionToken", {
    domain: "localhost",
    expiry: 999999999999,
    path: "/",
  });
cy.visit("http://localhost:3000")
```

### Cookies & Test tools
- [Selenium](https://www.selenium.dev/documentation/en/support_packages/working_with_cookies/)
- [Cypress](https://docs.cypress.io/api/commands/setcookie.html#Syntax)