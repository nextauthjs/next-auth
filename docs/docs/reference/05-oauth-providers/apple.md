---
id: apple
title: Apple
---

## Documentation

https://developer.apple.com/sign-in-with-apple/get-started/

## Configuration

https://developer.apple.com/account/resources/identifiers/list/serviceId

## Options

The **Apple Provider** comes with a set of default options:

- [Apple Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/apple.ts)

You can override any of the options to suit your own use case.

### Generating a secret

Apple requires the client secret to be a JWT. To generate one, you can use the following script: https://bal.so/apple-gen-secret.

For more information, see the [Apple docs](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens#3262048)

Then, you can paste the result into your `.env.local` file under `APPLE_SECRET`, so you can refer to it from your code:

```js
import AppleProvider from "next-auth/providers/apple";
...
providers: [
  AppleProvider({
    clientId: process.env.APPLE_ID,
    clientSecret: process.env.APPLE_SECRET
  })
]
...
```

:::tip
The TeamID is located on the top right after logging in.
:::

:::tip
The KeyID is located after you create the key. Look for it before you download the k8 file.
:::

## Testing on a development server

:::tip
Apple requires all sites to run HTTPS (including local development instances).
:::

:::tip
Apple doesn't allow you to use localhost in domains or subdomains.
:::

### Host name resolution

Edit your host file and point your site to `127.0.0.1`.

_Linux/macOS_

```
sudo echo '127.0.0.1 dev.example.com' >> /etc/hosts
```

_Windows_ (run PowerShell as administrator)

```ps
Add-Content -Path C:\Windows\System32\drivers\etc\hosts -Value "127.0.0.1 dev.example.com" -Force
```

More info: [How to edit my host file?](https://phoenixnap.com/kb/how-to-edit-hosts-file-in-windows-mac-or-linux)

### Create certificate

Create a directory `certificates` and add the certificate files `localhost.key` and `localhost.crt`, which you generate using OpenSSL:

_Linux/macOS_

```bash
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj "/CN=localhost" -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

_Windows_

The OpenSSL executable is distributed with [Git](https://git-scm.com/download/win) for Windows. Once installed you will find the openssl.exe file in `C:\Program Files\Git\mingw64\bin`, which you can add to the system PATH environment variable if it’s not already done.

Add environment variable `OPENSSL_CONF=C:\Program Files\Git\mingw64\ssl\openssl.cnf`

```cmd
 req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj "/CN=localhost"
```

### Deploy to server

You can create a `server.js` in the root of your project and run it with `node server.js` to test Sign in with Apple integration locally:

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

### Helpful guides

- [How to setup localhost with HTTPS with a Next.js app](https://medium.com/@anMagpie/secure-your-local-development-server-with-https-next-js-81ac6b8b3d68)

- [Guide to configuring Sign in with Apple](https://developer.okta.com/blog/2019/06/04/what-the-heck-is-sign-in-with-apple)
