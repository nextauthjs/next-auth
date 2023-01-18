---
title: Client
---

In addition to the [Astro components](/reference/astro/components) provided by `@auth/astro/components`, Astro Auth also exposes a few non-component methods for use within your website. These methods can be imported from `@auth/astro/client`. To use the methods, you _must_ use a script tag in your HTML, __without__ an `is:inline` directive.

## signIn

The `signIn` method is used to sign in a user with a specific provider. It takes a `provider` string as well as an optional `options` object with keys `callbackUrl` and `redirect`. A third argument is present for [additional parameters](https://next-auth.js.org/getting-started/client#additional-parameters).

```html
<button id="signin">Sign in</button>

<script>
  import { signIn } from '@auth/astro/client'
  document.querySelector('signin')?.addEventListener('click', () => {
    signIn('github')
  })
</script>
```

## signOut

The `signOut` method is used to sign out a user. It also accepts the optional `options` object with keys `callbackUrl` and `redirect`.

```html
<button id="signout">Sign out</button>

<script>
  import { signOut } from '@auth/astro/client'
  document.querySelector('signout')?.addEventListener('click', () => {
    signOut()
  })
</script>
```
