---
id: wikimedia
title: Wikimedia
---

## Documentation

https://www.mediawiki.org/wiki/Extension:OAuth

This provider also supports all Wikimedia projects:

- Wikipedia
- Wikidata
- Wikibooks
- Wiktionary
- etc..

Please be aware that Wikimedia accounts do not have to have an associated email address. So you may want to add check if the user has an email address before allowing them to login.

## Configuration

1. Go to and accept the Consumer Registration doc: https://meta.wikimedia.org/wiki/Special:OAuthConsumerRegistration
2. Request a new OAuth 2.0 consumer to get the `clientId` and `clientSecret`: https://meta.wikimedia.org/wiki/Special:OAuthConsumerRegistration/propose/oauth2
  2a. Add the following redirect URL into the console `http://<your-next-app-url>/api/auth/callback/wikimedia`
  2b. Do not check the box next to `This consumer is only for [your username]`
  2c. Unless you explicitly need a larger scope, feel free to select the radio button labelled `User identity verification only - no ability to read pages or act on the users behalf.`

After registration, you can initally test your application only with your own Wikimedia account. You may have to wait several days for the application to be approved for it to be used by everyone.

## Options

The **Wikimedia Provider** comes with a set of default options:

- [Wikimedia Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/wikimedia.ts)

You can override any of the options to suit your own use case.

## Example

```js
import WikimediaProvider from "next-auth/providers/wikimedia";
...
providers: [
  WikimediaProvider({
    clientId: process.env.WIKIMEDIA_CLIENT_ID,
    clientSecret: process.env.WIKIMEDIA_CLIENT_SECRET
  })
]
...
```
