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

### Provider

If you're having trouble with your provider when using the `https-proxy-agent`, you may be using a provider which requires an extra request to, for example, fetch the users profile picture. In cases like these, you'll have to add the proxy workaround to your provider config as well. Below is an example of how to do that with the `AzureAD` provider.

```diff
diff --git a/node_modules/next-auth/providers/azure-ad.js b/node_modules/next-auth/providers/azure-ad.js
index 73d96d3..536cd81 100644
--- a/node_modules/next-auth/providers/azure-ad.js
+++ b/node_modules/next-auth/providers/azure-ad.js
@@ -5,6 +5,8 @@ Object.defineProperty(exports, "__esModule", {
 });
 exports.default = AzureAD;

+const HttpsProxyAgent = require('https-proxy-agent');
+
 function AzureAD(options) {
   var _options$tenantId, _options$profilePhoto;

@@ -22,11 +24,15 @@ function AzureAD(options) {
     },

     async profile(profile, tokens) {
-      const profilePicture = await fetch(`https://graph.microsoft.com/v1.0/me/photos/${profilePhotoSize}x${profilePhotoSize}/$value`, {
+      let fetchOptions = {
         headers: {
-          Authorization: `Bearer ${tokens.access_token}`
-        }
-      });
+          Authorization: `Bearer ${tokens.access_token}`,
+        },
+      };
+      if (process.env.http_proxy) {
+        fetchOptions.agent = new HttpsProxyAgent(process.env.http_proxy);
+      }
+      const profilePicture = await fetch(`https://graph.microsoft.com/v1.0/me/photos/${profilePhotoSize}x${profilePhotoSize}/$value`, fetchOptions);

       if (profilePicture.ok) {
         const pictureBuffer = await profilePicture.arrayBuffer();
```
