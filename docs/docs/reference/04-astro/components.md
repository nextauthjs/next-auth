---
title: Client Components
---

Astro Auth exposes a few Astro components for use with your website. These components can be imported from `@auth/astro/components`.

## Components

### SignIn

The SignIn Component is an unstyled button element that handles the slightly awkward importing of the `signIn` method from `@auth/astro/client`. You can pass the `provider`'s name as a string, as well as an `options` object with the keys `callbackUrl` and `redirect`. A third argument is present for [additional parameters](https://next-auth.js.org/getting-started/client#additional-parameters).

```jsx
---
import { SignIn } from '@auth/astro/components'
---

<SignIn
  provider="github"
  options={{ callbackUrl: '...', redirect: '...' }}
  authParams={...}
/>
```

### SignOut

The Signout component is an unstyled button element that handles the slightly awkward importing of the `signOut` method from `@auth/astro/client`. You can pass the `options` allowing `callbackUrl` and `redirect`.

```jsx
---
import { SignOut } from '@auth/astro/components'
---

<SignOut options={{ callbackUrl: '...', redirect: '...' }} />
```

### Auth

The Auth component is a wrapper component that allows you to conditionally render content based on the user's authentication status. It takes a `session` prop and a JSX-like method returning Astro markup. The session prop may be accessed from within the Astro markup as shown below.

:::caution
The `Auth` component may only have a single child element, rendered as a function.
:::

```jsx
---
import type { Session } from '@auth/core/types';
import { getSession } from "@auth/astro"
import { Auth } from '@auth/astro/components';

let session = await getSession(Astro.request, authOpts)
---

<Auth session={session}>
  {(session: Session) => session ? 
    <p>Welcome {session.user?.name}</p>
  :
    <p>Not logged in</p>
  }
</Auth>
```
