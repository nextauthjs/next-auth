---
title: Upgrade Guide (v5)
---

NextAuth.js version 5 will continue to be shipped as `next-auth` **for the Next.js version only**. We're here to help you upgrade your applications as smoothly as possible. It is possible to upgrade from any version of 4.x to the latest v5 release by following the  migration steps below.

Upgrade to the latest version by running:

```bash npm2yarn2pnpm
npm install next-auth@latest
```

## Getting Started

Below is a summary of the high-level API changes in `next-auth` v5.

| Where                     | Old                                                 | New            |
| ------------------------- | --------------------------------------------------- | -------------- |
| [API Route (Node)](#api-route-node)          | `getServerSession(req, res, authOptions)`             | `auth()` wrapper |))
| [API Route (Edge)](#api-route-edge)          | -                                                   | `auth()` wrapper |
| [getServerSideProps](#getserversideprops)        | `getServerSession(ctx.req, ctx.res, authOptions)`     | `auth()` wrapper |
| [Middleware](#middleware)                | `withAuth(middleware, subset of authOptions)` wrapper | `auth()` wrapper |
| [Route Handler](#route-handler)             | -                                                   | `auth()` wrapper |
| [Server Component](#server-component)          | `getServerSession(authOptions)`                       | `auth()` call    |
| [Client Component](#client-component)          | `useSession()` hook                                   | `useAuth()` hook |

## Breaking Changes

- The import `next-auth/next` is no longer available
- The import `next-auth/react` is no longer available
- The import `next-auth/middleware` is no longer available

## API Route (Node)

## API Route (Edge)

## `getServerSideProps`

## Middleware

## Route Handler

## Server Component

## Client Component


## Summary

We hope this migration goes smoothly for each and every one of you! If you have any questions or get stuck anywhere, feel free to create [a new issue](https://github.com/nextauthjs/next-auth/issues/new) on GitHub.
