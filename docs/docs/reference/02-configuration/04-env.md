---
title: Environment variables
sidebar_label: Environment Variables
---

## NEXTAUTH_URL

When deploying to production, set the `NEXTAUTH_URL` environment variable to the canonical URL of your site.

```
NEXTAUTH_URL=https://example.com
```

If your Next.js application uses a custom base path, specify the route to the API endpoint in full.

_e.g. `NEXTAUTH_URL=https://example.com/custom-route/api/auth`_

:::note
Using [System Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables) we automatically detect when you deploy to [Vercel](https://vercel.com) so you don't have to define this variable. Make sure **Automatically expose System Environment Variables** is checked in your Project Settings.
:::

---

## NEXTAUTH_SECRET

Used to encrypt the Auth.js JWT, and to hash [email verification tokens](/reference/adapters/models#verification-token). This is the default value for the [`secret`](/reference/configuration/auth-config#secret) option. The `secret` option might be removed in the future in favor of this.

If you are using [Middleware](/reference/nextjs/#prerequisites) this environment variable must be set.

---

## NEXTAUTH_URL_INTERNAL

If provided, server-side calls will use this instead of `NEXTAUTH_URL`. Useful in environments when the server doesn't have access to the canonical URL of your site. Defaults to `NEXTAUTH_URL`.

```
NEXTAUTH_URL_INTERNAL=http://10.240.8.16
```
