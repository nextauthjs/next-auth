---
title: Session strategies
---

When a user logs into your application, you usually want them to not need to log in for some time. This is called a session. Auth.js libraries support different session strategies, which are described below.

:::note
Both strategies have advantages and disadvantages which you have to evaluate based on your requirements
:::

Check out the [`session.strategy`](/reference/core#session) option to see how you can configure the session strategy of your Auth.js library.

## JWT

Auth.js libraries can create sessions using [JSON Web Tokens (JWT)](https://datatracker.ietf.org/doc/html/rfc7519). This is the default session strategy for Auth.js libraries. When a user signs in, a JWT is created in a `HttpOnly` cookie. Making the cookie HttpOnly prevents JavaScript from accessing it client-side (`document.cookie`), which makes it harder for attackers to steal the value. In addition, the JWT is encrypted with a secret key only known to the server. So even if an attacker were to steal the JWT from the cookie, they would not be able to decrypt it. Combined with a short expiration time, this makes JWTs a secure way to create sessions.

When a user signs out, the JWT is deleted from the cookies, and the session is destroyed.

### Advantages

- JWTs as a session do not require a database to store sessions, this can be faster and cheaper to run and easier to scale.
- Retrieving a JWT session can always run on the Edge.
- Using this strategy requires fewer resources as you don't need to manage an extra database/service.
- You may then use the created token to pass information between services and APIs on the same domain without having to contact a database to verify the included information.
- You can use JWT to securely store information without exposing it to third-party JavaScript running on your site.

### Disadvantages

- Expiring a JSON Web Token before its encoded expiry is not possible - doing so requires maintaining a server-side blocklist of invalidated tokens (at least until they truly expire) and checking every token against the list every time a token is presented. Auth.js **will** destroy the cookie, but if the user has the JWT saved elsewhere, it will be valid (the server will accept it) until it expires. (Shorter session expiry times are used when using JSON Web Tokens as session tokens to allow sessions to be invalidated sooner and simplify this problem.)
- Auth.js clients enable advanced features to mitigate the downsides of using shorter session expiry times on the user experience, including automatic session token rotation, optionally sending keep-alive messages (session polling) to prevent short-lived sessions from expiring if there is a window or tab open, background re-validation, and automatic tab/window syncing that keeps sessions in sync across windows any time session state changes or a window or tab gains or loses focus.
- As with database session tokens, JSON Web Tokens are limited in the amount of data you can store in them. There is typically a limit of around 4096 bytes per cookie, though the exact limit varies between browsers. The more data you try to store in a token and the more other cookies you set, the closer you will come to this limit. Auth.js libraries implement session cookie chunking so that cookies over the 4kb limit will get split and reassembled upon parsing. However since this data needs to be transmitted on every request, you need to be aware of how much data you want to transfer using this technique.
- Even if appropriately configured, information stored in an encrypted JWT should not be assumed to be impossible to decrypt at some point - e.g. due to the discovery of a defect or advances in technology. Data stored in an encrypted JSON Web Token (JWE) _may_ be compromised at some point. The recommendation is to generate a [secret](/reference/core#secret) with high entropy.

## Database

Alternatively, to a JWT session strategy, Auth.js libraries also support database sessions. In this case, instead of saving a JWT with user data after signing in, Auth.js libraries will create a session in your database. A session ID is then saved in a `HttpOnly` cookie. This is similar to the JWT session strategy, but instead of saving the user data in the cookie, it only stores an obscure value pointing to the session in the database. So whenever you will try to access the user session, you will query the database for the data.

When a user signs out, the session is deleted from the database, and the session ID is deleted from the cookies.

### Advantages

- Database sessions can be at any time modified server-side, so you can implement features that might be more difficult - but not impossible - using the JWT strategy, etc.: "sign out everywhere", or limiting concurrent logins
- Auth.js has no opinion on the type of database you are using, we have a big list of [official database adapters](/reference/core/adapters), but you can [implement your own](guides/adapters/creating-a-database-adapter) as well

### Disadvantages

- Database sessions need a roundtrip to your database, so they might be slower on scale unless your connections/databases are accommodated for it
- Many database adapters are not yet compatible with the Edge, which would allow faster and cheaper session retrieval
- Setting up a database takes more effort and requires extra services to manage compared to the stateless JWT strategy
