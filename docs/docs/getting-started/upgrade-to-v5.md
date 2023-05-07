---
title: Upgrade Guide (v5)
---

NextAuth.js version 5 will continue to be shipped as `next-auth` *for the Next.js version only*. We're here to help you upgrade your applications as smoothly as possible. It is possible to upgrade from any version of 4.x to the latest v5 release by following the  migration steps below.

Upgrade to the latest version by running:

```bash npm2yarn2pnpm
npm install next-auth
```

## Getting Started

Below is a summary of the high-level API changes in `next-auth` v5.

```
| Where                     | Old                                                 | New            |
| ------------------------- | --------------------------------------------------- | -------------- |
| API Route (Node)          | getServerSession(req, res, authOptions)             | auth() wrapper |
| API Route (Edge)          | -                                                   | auth() wrapper |
| getServerSideProps        | getServerSession(ctx.req, ctx.res, authOptions)     | auth() wrapper |
| Middleware                | withAuth(middleware, subset of authOptions) wrapper | auth() wrapper |
| Route Handler             | -                                                   | auth() wrapper |
| Server Component          | getServerSession(authOptions)                       | auth() call    |
| Client Component          | useSession() hook                                   | useAuth() hook |
```


## Summary

We hope this migration goes smoothly for each and every one of you! If you have any questions or get stuck anywhere, feel free to create [a new issue](https://github.com/nextauthjs/next-auth/issues/new) on GitHub.
