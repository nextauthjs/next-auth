---
id: bungie
title: Bungie
---

## Documentation

https://github.com/Bungie-net/api/wiki/OAuth-Documentation

## Configuration

https://www.bungie.net/en/Application

## Options

The **Bungie Provider** comes with a set of default options:

- [Bungie Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/bungie.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Bungie({
    clientId: process.env.BUNGIE_CLIENT_ID,
    clientSecret: process.env.BUNGIE_SECRET,
    headers: {
      'X-API-Key': provess.env.BUNGIE_API_KEY
    }
  }),
]
...
```

### Configuration

:::tip
Bungie requires all sites to run HTTPS (including local development instances).
:::

:::tip
Bungie doesn't allow you to use localhost as the website URL, instead you need to use https://127.0.0.1:3000
:::

Navigate to https://www.bungie.net/en/Application and fill in the required details:

- Application name
- Application Status
- Website
- OAuth Client Type
  - Confidential
- Redirect URL
  - https://localhost:3000/api/auth/callback/bungie
- Scope
  - `Access items like your Bungie.net notifications, memberships, and recent Bungie.Net forum activity.`
- Origin Header

The following guide may be helpful:

- [How to setup localhost with HTTPS with a Next.js app](https://medium.com/@anMagpie/secure-your-local-development-server-with-https-next-js-81ac6b8b3d68)

### Example server

You will need to edit your host file and point your site at `127.0.0.1`

[How to edit my host file?](https://phoenixnap.com/kb/how-to-edit-hosts-file-in-windows-mac-or-linux)

On Windows (Run Powershell as administrator)

```ps
Add-Content -Path C:\Windows\System32\drivers\etc\hosts -Value "127.0.0.1`tdev.example.com" -Force
```

```
127.0.0.1 dev.example.com
```

#### Create certificate

Creating a certificate for localhost is easy with openssl. Just put the following command in the terminal. The output will be two files: localhost.key and localhost.crt.

```bash
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

:::tip
**Windows**

The OpenSSL executable is distributed with [Git](https://git-scm.com/download/win]9) for Windows.
Once installed you will find the openssl.exe file in `C:/Program Files/Git/mingw64/bin` which you can add to the system PATH environment variable if it’s not already done.

Add environment variable `OPENSSL_CONF=C:/Program Files/Git/mingw64/ssl/openssl.cnf`

```bash
 req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost'
```

:::

Create directory `certificates` and place `localhost.key` and `localhost.crt`

You can create a `server.js` in the root of your project and run it with `node server.js` to test Sign in with Bungie integration locally:

```js
const { createServer } = require("https")
const { parse } = require("url")
const next = require("next")
const fs = require("fs")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

const httpsOptions = {
  key: fs.readFileSync("./certificates/localhost.key"),
  cert: fs.readFileSync("./certificates/localhost.crt"),
}

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(3000, (err) => {
    if (err) throw err
    console.log("> Ready on https://localhost:3000")
  })
})
```
