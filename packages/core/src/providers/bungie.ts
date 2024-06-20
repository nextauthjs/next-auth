/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Bungie</b> integration.</span>
 * <a href="https://bungie.net/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/bungie.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/bungie
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Add Bungie login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/bungie
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Bungie from "@auth/core/providers/bungie"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Bungie({
 *       clientId: BUNGIE_CLIENT_ID,
 *       clientSecret: BUNGIE_CLIENT_SECRET,
 *       headers: { "X-API-Key": BUNGIE_API_KEY },
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Bungie OAuth documentation](https://github.com/Bungie-net/api/wiki/OAuth-Documentation)
 *
 * ## Configuration
 *
 * :::tip
 * Bungie require all sites to run HTTPS (including local development instances).
 * :::
 *
 * :::tip
 * Bungie doesn't allow you to use localhost as the website URL, instead you need to use https://127.0.0.1:3000
 * :::
 *
 * Navigate to https://www.bungie.net/en/Application and fill in the required details:
 *
 * - Application name
 * - Application Status
 * - Website
 * - OAuth Client Type
 *   - Confidential
 * - Redirect URL
 *   - https://localhost:3000/api/auth/callback/bungie
 * - Scope
 *   - `Access items like your Bungie.net notifications, memberships, and recent Bungie.Net forum activity.`
 * - Origin Header
 *
 * The following guide may be helpful:
 *
 * - [How to setup localhost with HTTPS with a Next.js app](https://medium.com/@anMagpie/secure-your-local-development-server-with-https-next-js-81ac6b8b3d68)
 *
 * #@example server
 *
 * You will need to edit your host file and point your site at `127.0.0.1`
 *
 * [How to edit my host file?](https://phoenixnap.com/kb/how-to-edit-hosts-file-in-windows-mac-or-linux)
 *
 * On Windows (Run PowerShell as administrator)
 *
 * ```ps
 * Add-Content -Path C:\Windows\System32\drivers\etc\hosts -Value "127.0.0.1`tdev.example.com" -Force
 * ```
 *
 * ```
 * 127.0.0.1 dev.example.com
 * ```
 *
 * ### Create certificate
 *
 * Creating a certificate for localhost is easy with openssl. Just put the following command in the terminal. The output will be two files: localhost.key and localhost.crt.
 *
 * ```bash
 * openssl req -x509 -out localhost.crt -keyout localhost.key \
 *   -newkey rsa:2048 -nodes -sha256 \
 *   -subj "/CN=localhost" -extensions EXT -config <( \
 *    printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
 * ```
 *
 * :::tip
 * **Windows**
 *
 * The OpenSSL executable is distributed with [Git](https://git-scm.com/download/win]9) for Windows.
 * Once installed you will find the openssl.exe file in `C:/Program Files/Git/mingw64/bin` which you can add to the system PATH environment variable if it’s not already done.
 *
 * Add environment variable `OPENSSL_CONF=C:/Program Files/Git/mingw64/ssl/openssl.cnf`
 *
 * ```bash
 *  req -x509 -out localhost.crt -keyout localhost.key \
 *   -newkey rsa:2048 -nodes -sha256 \
 *   -subj "/CN=localhost"
 * ```
 *
 * :::
 *
 * Create directory `certificates` and place `localhost.key` and `localhost.crt`
 *
 * You can create a `server.js` in the root of your project and run it with `node server.js` to test Sign in with Bungie integration locally:
 *
 * ```js
 * const { createServer } = require("https")
 * const { parse } = require("url")
 * const next = require("next")
 * const fs = require("fs")
 *
 * const dev = process.env.NODE_ENV !== "production"
 * const app = next({ dev })
 * const handle = app.getRequestHandler()
 *
 * const httpsOptions = {
 *   key: fs.readFileSync("./certificates/localhost.key"),
 *   cert: fs.readFileSync("./certificates/localhost.crt"),
 * }
 *
 * app.prepare().then(() => {
 *   createServer(httpsOptions, (req, res) => {
 *     const parsedUrl = parse(req.url, true)
 *     handle(req, res, parsedUrl)
 *   }).listen(3000, (err) => {
 *     if (err) throw err
 *     console.log("> Ready on https://localhost:3000")
 *   })
 * })
 * ```
 *
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Bungie provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Bungie provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/bungie.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * :::
 *
 * :::info **Disclaimer**
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 *
 * :::
 */
export default function Bungie(
  options: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "bungie",
    name: "Bungie",
    type: "oauth",
    authorization: "https://www.bungie.net/en/OAuth/Authorize?reauth=true",
    token: "https://www.bungie.net/platform/app/oauth/token/",
    userinfo:
      "https://www.bungie.net/platform/User/GetBungieAccount/{membershipId}/254/",
    profile(profile) {
      const { bungieNetUser: user } = profile.Response

      return {
        id: user.membershipId,
        name: user.displayName,
        email: null,
        image: `https://www.bungie.net${
          user.profilePicturePath.startsWith("/") ? "" : "/"
        }${user.profilePicturePath}`,
      }
    },
    options,
  }
}
