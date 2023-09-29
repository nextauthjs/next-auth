---
title: Session strategies
---

When a user logs into your application, you usually want them to be able to stay logged in for some time. This is called a session. Auth.js libraries support different session strategies, which are described below.

Check out the [`session.strategy`](/reference/core#session) option of your Auth.js library to learn how to configure the JWT session strategy.

## JWT

Auth.js libraries can create sessions using [JSON Web Tokens (JWT)](https://datatracker.ietf.org/doc/html/rfc7519). This is the default session strategy for Auth.js libraries. When a user signs in, a JWT is created in a `HttpOnly` cookie. Making the cookie HttpOnly prevents JavaScript from accessing it client-side (`document.cookie`), which makes it harder for attackers to steal the value. In addition, the JWT is encrypted with a secret key only known to the server. So even if an attacker were to steal the JWT from the cookie, they would not be able to decrypt it. Combined with a short expiration time, this makes JWTs a secure way to create sessions.

When a user signs out, the JWT is deleted from the cookies, and the session is destroyed.

## Database

Alternatively to a JWT session strategy, Auth.js libraries also support database sessions. In this case, instead of saving a JWT with user data after signing in, Auth.js libraries will create a session in your database. The session ID is then saved in a `HttpOnly` cookie. This is similar to the JWT session strategy, but instead of saving the user data in the cookie, it only stores an obscure value pointing to the session in the database.

When a user signs out, the session is deleted from the database, and the session ID is deleted from the cookies.