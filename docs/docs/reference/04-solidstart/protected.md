---
title: Protected
---

# Protected Routes

## When Using SSR

When using SSR, I recommend creating a `Protected` component that will trigger suspense using the `Show` component. It should look like this:


```tsx
// components/Protected.tsx
import { type Session } from "@auth/core";
import { getSession } from "@auth/solid-start";
import { Component, Show } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { authOpts } from "~/routes/api/auth/[...solidauth]";

const Protected = (Comp: IProtectedComponent) => {
  const routeData = () => {
    return createServerData$(
      async (_, event) => {
        const session = await getSession(event.request, authOpts);
        if (!session || !session.user) {
          throw redirect("/");
        }
        return session;
      },
      { key: () => ["auth_user"] }
    );
  };

  return {
    routeData,
    Page: () => {
      const session = useRouteData<typeof routeData>();
      return (
        <Show when={session()} keyed>
          {(sess) => <Comp {...sess} />}
        </Show>
      );
    },
  };
};

type IProtectedComponent = Component<Session>;

export default Protected;
```

It can be used like this:


```tsx
// routes/protected.tsx
import Protected from "~/components/Protected";

export const { routeData, Page } = Protected((session) => {
  return (
    <main class="flex flex-col gap-2 items-center">
      <h1>This is a proteced route</h1>
    </main>
  );
});

export default Page;
```

## When Using CSR

When using CSR, the `Protected` component will not work as expected and will cause the screen to flash, so I had to come up with a tricky solution, we will use a Solid-Start middleware:

```tsx
// entry-server.tsx
import { Session } from "@auth/core";
import { getSession } from "@auth/solid-start";
import { redirect } from "solid-start";
import {
  StartServer,
  createHandler,
  renderAsync,
} from "solid-start/entry-server";
import { authOpts } from "./routes/api/auth/[...solidauth]";

const protectedPaths = ["/protected"]; // add any route you wish in here

export default createHandler(
  ({ forward }) => {
    return async (event) => {
      if (protectedPaths.includes(new URL(event.request.url).pathname)) {
        const session = await getSession(event.request, authOpts);
        if (!session) {
          return redirect("/");
        }
      }
      return forward(event);
    };
  },
  renderAsync((event) => <StartServer event={event} />)
);
```

And now you can easily create a protected route:


```tsx
// routes/protected.tsx
export default () => {
  return (
    <main class="flex flex-col gap-2 items-center">
      <h1>This is a proteced route</h1>
    </main>
  );
};
```

**Note: the CSR method should also work when using SSR, the SSR method shouldn't work when using CSR**
