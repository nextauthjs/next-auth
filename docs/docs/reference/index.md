---
title: Overview
---

This section of the documentation contains the API reference for all the official packages under the `@auth/*` and `@next-auth/*` scopes.

## Roadmap

Here are the _state_ of planned and released packages under the `@auth/*` and `@next-auth/*` scope, as well as `next-auth`. This is not an exhaustive list, but the set of packages that we would like to focus on, to begin with.

|        Feature         |  Status  |
| ---------------------- | -------- |
| `next-auth`            | Release (stable). See [docs](https://next-auth.js.org) |
| `@auth/*-adapter`      | Released (stable). Fully compatible with `next-auth` and all `@auth/*` libraries.   |
| `@next-auth/*-adapter` | Maintenance has stopped. Update to `@auth/*-adapter`. See above.  |
| `@auth/core`           | Released (experimental). |
| `@auth/sveltekit`      | Released (experimental, [help needed](#help-needed)). |
| `@auth/solid-start`    | Released (experimental, [help needed](#help-needed)). Community package: [`@solid-mediakit/auth`](https://www.npmjs.com/package/@solid-mediakit/auth) |
| `@auth/express`        | [Planned](https://github.com/nextauthjs/next-auth/issues/8257). |
| `@auth/remix`          | Planned, [help needed](#help-needed). |
| `@auth/astro`          | Planned, [help needed](#help-needed). |
| `@auth/nuxt`           | Planned, [help needed](#help-needed). Community packages: [`@sidebase/nuxt-auth`](https://github.com/sidebase/nuxt-auth), [`@hebilicious/authjs-nuxt`](https://authjs-nuxt.pages.dev/) |

:::info
`next-auth` is still the official package for Next.js. The documentation is at [next-auth.js.org](https://next-auth.js.org), while guides are being migrated over to the new documentation page. A major refactor of `next-auth` is on the way, you can [follow this PR](https://github.com/nextauthjs/next-auth/pull/7443) for updates.
:::

### Help needed

In case you are a maintainer of a package that uses `@auth/core`, feel free to [reach out to Balázs](https://twitter.com/balazsorban44), if you want to collaborate on making it an official package, maintained in our repository. If you are interested in bringing `@auth/core` support to your favorite framework, we would love to hear from you!

#### Community Packages

While we are migrating the documentation and working on stabilizing the core package, the community has been working on some packages that are already available. With collaboration, we hope to make these packages official in the future.