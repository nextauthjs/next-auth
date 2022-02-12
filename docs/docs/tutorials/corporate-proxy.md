--
id: corporate-proxy
title: Add support for HTTP Proxy
--

Using NextAuth.js behind a corporate proxy is not supported out of the box. This is due to the fact that the underlying library we use, [`openid-client`](https://npm.im/openid-client), uses the built-in Node.js `http` / `https` libraries ([Source](As)), which do not support proxys by default. (See: [`http` docs](https://nodejs.org/dist/latest-v16.x/docs/api/http.html), [`https` docs](https://nodejs.org/dist/latest-v16.x/docs/api/https.html)).

Therefore, we'll need to an additional proxy agent to the http client, such as `https-proxy-agent`. `openid-client` allows the user to set an `agent` for requests ([Source](https://github.com/panva/node-openid-client/blob/main/docs/README.md#customizing-individual-http-requests).

Thanks to [raphaelpc](https://github.com/raphaelpc) for the below diff, which when applied to `v4.2.1`, adds this agent support to the `client.js` file.

```diff
diff --git a/node_modules/next-auth/core/lib/oauth/client.js b/node_modules/next-auth/core/lib/oauth/client.js
index 77161bd..1082fba 100644
--- a/node_modules/next-auth/core/lib/oauth/client.js
+++ b/node_modules/next-auth/core/lib/oauth/client.js
@@ -7,11 +7,19 @@ exports.openidClient = openidClient;

 var _openidClient = require("openid-client");

+var HttpsProxyAgent = require("https-proxy-agent");
+
 async function openidClient(options) {
   const provider = options.provider;
-  if (provider.httpOptions) _openidClient.custom.setHttpOptionsDefaults(provider.httpOptions);
-  let issuer;
+  let httpOptions = {};
+  if (provider.httpOptions) httpOptions = { ...provider.httpOptions };
+  if (process.env.http_proxy) {
+    let agent = new HttpsProxyAgent(process.env.http_proxy);
+    httpOptions.agent = agent;
+  }
+  _openidClient.custom.setHttpOptionsDefaults(httpOptions);

+  let issuer;
   if (provider.wellKnown) {
     issuer = await _openidClient.Issuer.discover(provider.wellKnown);
   } else {
```

> For more details, see [this issue](https://github.com/nextauthjs/next-auth/issues/2509#issuecomment-1035410802)

After applying this patch, we can add the the proxy connecting string via the `http_proxy` environment variable.
