Imports from `next-auth/react` are now marked with the `"use client"` directive. [Read more](https://nextjs.org/docs/getting-started/react-essentials#the-use-client-directive).

If you have previously used `getSession()` or other imports server-side, you'll have to change it to use the [`auth()`](/reference/nextjs#auth) method instead.

`getCsrfToken` and `getProviders` are still available as imports, but we plan to deprecate them in the future and introduce a new API to get this data server-side.

Client-side: Instead of using these APIs, you can make a fetch request to the `/api/auth/providers` and `/api/auth/csrf` endpoints respectively.

Server-side: 
- Get the list of providers from your config's `providers` array
- Check out the [CSRF_experimental](/reference/nextjs#csrf_experimental) React component