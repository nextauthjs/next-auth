---
id: apple
title: Apple
---

## Documentation

https://developer.apple.com/sign-in-with-apple/get-started/

## Configuration

https://developer.apple.com/account/resources/identifiers/list/serviceId

## Example

There are two ways you can use the Sign in with Apple provider.

### Dynamically generated secret

If you use a dynamically generated secret you never have to to manually update the server.

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Apple({
    clientId: process.env.APPLE_ID,
    clientSecret: { 
      appleId: process.env.APPLE_ID,
      teamId: process.env.APPLE_TEAM_ID,
      privateKey: process.env.APPLE_PRIVATE_KEY,
      keyId: process.env.APPLE_KEY_ID,
    }
  })
}
...
```

:::tip

You can convert your Apple key to a single line to use it in a environment variable.

**Mac**
   
```bash
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}'  AuthKey_ID.k8
```
  
**Windows**
  
```powershell
 $k8file = "AuthKey_ID.k8"
(Get-Content "C:\Users\$env:UserName\Downloads\${k8file}") -join "\n" 
```
  
:::

### Pre-generated secret

If you use a pre-generated secret you can avoid adding your private key as an environment variable.

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Apple({
    clientId: process.env.APPLE_ID,
    clientSecret: process.env.APPLE_KEY_SECRET,
    clientSecretCallback: false
  })
}
...
```

:::tip
The TeamID is located on the top right after logging in.
:::

:::tip
The KeyID is located after you create the Key look for before you download the k8 file.
:::

## Instructions

### Testing

:::tip
Apple requires all sites to run HTTPS (including local development instances).
:::

:::tip
Apple doesn't allow you to use localhost in domains or subdomains.
:::

The following guides may be helpful:

* [How to setup localhost with HTTPS with a Next.js app](https://medium.com/@anMagpie/secure-your-local-development-server-with-https-next-js-81ac6b8b3d68)

* [Guide to configuring Sign in with Apple](https://developer.okta.com/blog/2019/06/04/what-the-heck-is-sign-in-with-apple)

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


Creating a certificate for localhost is easy with openssl . Just put the following command in the terminal. The output will be two files: localhost.key and localhost.crt.

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


You can create a `server.js` in the root of your project and run it with `node server.js` to test Sign in with Apple integration locally:


```js
const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const httpsOptions = {
  key: fs.readFileSync('./certificates/localhost.key'),
  cert: fs.readFileSync('./certificates/localhost.crt')
}

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(3000, err => {
    if (err) throw err
    console.log('> Ready on https://localhost:3000')
  })
})
```

### Example JWT code

If you want to pre-generate your secret, this is an example of the code you will need:

```js
const jwt = require('jsonwebtoken')
const fs = require('fs')

const appleId = 'myapp.example.com'
const keyId = ''
const teamId = ''
const privateKey = fs.readFileSync('path/to/key')

const secret = jwt.sign(
  {
    iss: teamId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + ( 86400 * 180 ), // 6 months
    aud: 'https://appleid.apple.com',
    sub: appleId
  }, privateKey, {
    algorithm: 'ES256',
    keyid: keyId
  })

console.log(secret)
```
