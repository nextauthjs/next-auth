---
id: dropbox
title: Dropbox
---

## Documentation

https://developers.dropbox.com/oauth-guide

## Configuration

https://www.dropbox.com/developers/apps

## Options

The **Dropbox Provider** comes with a set of default options:

- [Dropbox Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/dropbox.js)

You can override any of the options to suit your own use case.

## Example

```js
import DropboxProvider from "next-auth/providers/dropbox";
...
providers: [
  DropboxProvider({
    clientId: process.env.DROPBOX_CLIENT_ID,
    clientSecret: process.env.DROPBOX_CLIENT_SECRET
  })
]
...
```
