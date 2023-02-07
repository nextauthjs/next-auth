<p align="center">
   <br/>
   <a href="https://authjs.dev" target="_blank"><img height="64px" src="https://authjs.dev/img/logo/logo-sm.png" /></a>
   <h3 align="center"><b>PocketBase Adapter</b> - Auth.js</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
</p>

## Overview

This is the PocketBase Adapter for [Auth.js](https://authjs.dev). This package is designed to be used in pair with the `Auth.js` npm package.

## Getting Started

1. Install the dependency npm packages `pocketbase`, `next-auth`, and `@next-auth/pocketbase-adapter`

```js
npm install next-auth @next-auth/pocketbase-adapter pocketbase
```

2. Download the latest [pocketbase executable](https://pocketbase.io/docs) and place executable at the root of your project.

```markdown
├── src
│ ├── main.ts
├── node_modules/
├── package.json
├── pocketbase <--- (.exe extension on WINDOWS OS)
```

3. Start the PocketBase executable, and complete the adminstrator setup.

```js
./pocketbase serve
// visit http://localhost:8090/ in a web browser
```

4. After completing the setup, add the Pocketbase Adapter to the Auth.js Configuration.

The values of `username` and `password` must match the same values you used in Pocketbase setup.

```js
import NextAuth from "next-auth"
import { PocketbaseAdapter } from "@next-auth/pocketbase-adapter"
import Pocketbase from "pocketbase"

const pb = new Pocketbase("http://127.0.0.1:8090")

export default NextAuth({
  providers: [
    // ...
  ],
  adapter: PocketbaseAdapter(pb, {
    username: process.env.PB_USERNAME,
    password: process.env.PB_PASSWORD,
  }),
  // ...
})
```

_Note_: In the above example the username and password are obscured through the use of environment variables. An example .env file is provided below.

```
PB_USERNAME=test@test.com
PB_PASSWORD=a-secure-password
```

## Contributing

By all means this adapter is open to community contributions. Feel free to open a pull request.
