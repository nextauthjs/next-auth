# Getting started

Install the following packages:

```bash
npm install @auth/express@latest @auth/core@latest
```

## Setting It Up

[Generate auth secret](https://generate-secret.vercel.app/32), then set it as an environment variable:

```
AUTH_SECRET=your_auth_secret
```

### On Production

Don't forget to trust the host.

```
AUTH_TRUST_HOST=true
```

## Creating the Express Router

TODO

in this example we are using github so make sure to set the following environment variables:

```
GITHUB_ID=your_github_oauth_id
GITHUB_SECRET=your_github_oauth_secret
```

```ts
// routes/auth.ts
```


## Getting the current session

```ts
import { getSession } from "@auth/express"
import { authOptions } from "./auth.router.ts"
const user = await getSession(req, authOptions)

```
