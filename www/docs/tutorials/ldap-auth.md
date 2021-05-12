---
id: ldap-auth-example
title: LDAP Authentication
---

NextAuth.js provides the ability to setup a [custom Credential provider](/configuration/providers#sign-in-with-credentials) which we can take advantage of to authenticate users against an existing LDAP server. 

You will need an additional dependency, `ldapjs`, which you can install by running `npm install ldapjs`.

Then you must setup the `Providers.Credentials()` provider key like so:

```js title="[...nextauth].js"
const ldap = require("ldapjs");
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: "LDAP",
      credentials: {
        username: { label: "DN", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You might want to pull this call out so we're not making a new LDAP client on every login attemp
        const client = ldap.createClient({
          url: process.env.LDAP_URI,
        });

        // Essentially promisify the LDAPJS client.bind function
        return new Promise((resolve, reject) => {
          client.bind(credentials.username, credentials.password, (error) => {
            if (error) {
              console.error("Failed");
              reject();
            } else {
              console.log("Logged in");
              resolve({
                username: credentials.username,
                password: credentials.password,
              });
            }
          });
        });
      },
    }),
  ],
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      const isSignIn = user ? true : false;
      if (isSignIn) {
        token.username = user.username;
        token.password = user.password;
      }
      return token;
    },
    async session(session, user) {
      return { ...session, user: { username: user.username } };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true, // Very important to encrypt the JWT, otherwise you're leaking username+password into the browser
  },
});
```

The idea is that once one is authenticated with the LDAP server, one can pass through both the username/DN and password to the JWT stored in the browser. 

This is then passed back to any API routes and retrieved as such:

```js title="/pages/api/doLDAPWork.js"
token = await jwt.getToken({
	req,
	secret: process.env.NEXTAUTH_SECRET,
});
const {username, password} = token;
```

> Thanks to [Winwardo](https://github.com/Winwardo) for the code example
