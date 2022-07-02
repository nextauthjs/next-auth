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

https://meta.wikimedia.org/wiki/Special:OAuthConsumerRegistration

After registration, you can initally test your application only with your Wikimedia account, but you may have to wait several days for the application to be approved for it to be used by everyone.

Add the following redirect URL into the console `http://<your-next-app-url>/api/auth/callback/wikimedia`

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
