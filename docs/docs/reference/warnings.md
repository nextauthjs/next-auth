---
id: warnings
title: Warnings
---

A list of warnings from Auth.js that need your attention.


## Debug enabled

The `debug` option was evaluated to `true`. It adds extra logs in the terminal which is useful in development, but since it can print sensitive information about users, make sure to set this to `false` in production. In Node.js environments, you can for example set `debug: process.env.NODE_ENV !== "production"`. Consult with your runtime/framework on how to set this value correctly.

## CSRF disabled

You were trying to get a CSRF response from Auth.js (eg.: by calling a `/csrf` endpoint), but in this setup, CSRF protection via Auth.js was turned off. This is likely if you are not directly using `@auth/core` but a framework library (like `@auth/sveltekit`) that already has CSRF protection built-in. You likely won't need the CSRF response.