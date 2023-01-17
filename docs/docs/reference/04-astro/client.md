---
title: Client
---

In addition to the [Astro components](/reference/astro/components) provided by `@auth/astro/components`, Astro Auth also exposes a few non-component methods for use with your website. These methods can be imported from `@auth/astro/client`. To use the methods, you need to use a script tag in your HTML, without an `is:inline` directive.

## signIn

The `signIn` method is used to sign in a user with a specific provider. It takes a `provider` as well as `options` allowing `callbackUrl` and `redirect`. A third argument is present for [additional parameters](https://next-auth.js.org/getting-started/client#additional-parameters).

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

The `signOut` method is used to sign out a user. It takes the `options` allowing `callbackUrl` and `redirect`.

```html
<button id="signout">Sign out</button>

<script>
  import { signOut } from '@auth/astro/client'
  document.querySelector('signout')?.addEventListener('click', () => {
    signOut()
  })
</script>
```
