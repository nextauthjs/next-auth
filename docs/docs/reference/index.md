---
title: Overview
---

This section of the documentation contains the API reference for all the official packages under the `@auth/*` and `@next-auth/*` scopes.

## Integrations

Here are the _state_ of planned and released integrations under the `@auth/*` and `@next-auth/*` scope, as well as `next-auth`. It also includes community created and maintained integrations. Integrations listed as "Planned" are something we'd love help with! See the [help needed](#help-needed) section below.

| Feature                | Status                                                                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `next-auth`            | Released (beta). See [docs](/reference/nextjs)                                                                                                                                         |
| `next-auth`            | Released (v4). See [docs](https://next-auth.js.org)                                                                                                                                    |
| `@auth/*-adapter`      | Released (stable). Fully compatible with `next-auth` and all `@auth/*` libraries.                                                                                                      |
| `@next-auth/*-adapter` | Maintenance has stopped. Update to `@auth/*-adapter`. See above.                                                                                                                       |
| `@auth/core`           | Released (experimental). See [docs](/reference/core)                                                                                                                                   |
| `@auth/sveltekit`      | Released (experimental). See [docs](/reference/sveltekit)                                                                                                                              |
| `@auth/solid-start`    | Released (experimental). See [docs](/reference/solidstart) Community package: [`@solid-mediakit/auth`](https://www.npmjs.com/package/@solid-mediakit/auth)                             |
| `@auth/express`        | Released (experimental). See [docs](/reference/express)                                                                                                                                |
| `@auth/remix`          | Planned.                                                                                                                                                                               |
| `@auth/astro`          | Planned. Community packages: [`auth-astro`](https://github.com/nowaythatworked/auth-astro)                                                                                             |
| `@auth/nuxt`           | Planned. Community packages: [`@sidebase/nuxt-auth`](https://github.com/sidebase/nuxt-auth), [`@hebilicious/authjs-nuxt`](https://authjs-nuxt.pages.dev/)                              |
| `@builder.io/qwik-auth`| Community package: [qwik integrations](https://qwik.builder.io/docs/integrations/authjs/#authjs)                                                                                       |

:::info
The NextAuth.js v4 documentation is at [next-auth.js.org](https://next-auth.js.org), while v5+ will be available [here](/reference/nextjs). Guides are being migrated over to the new documentation page and are gradually being updated to showcase all the framework integrations.
:::

### Help needed

In case you are a maintainer of a package that uses `@auth/core`, feel free to [reach out to Balázs](https://twitter.com/balazsorban44), if you want to collaborate on making it an official package, maintained in our repository. If you are interested in bringing `@auth/core` support to your favorite framework, we would love to hear from you!

#### Community Packages

While we are migrating the documentation and working on stabilizing the core package, the community has been working on some packages that are already available. With collaboration, we hope to make these packages official in the future.
