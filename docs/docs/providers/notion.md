---
id: notion
title: Notion
---

## Documentation

https://developers.notion.com/docs/authorization

## Configuration

https://www.notion.so/my-integrations

## Options

The **Notion Provider** comes with a set of default options:

- [Notion Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/notion.ts)

You can override any of the options to suit your own use case.

## Example

```js
import NotionProvider from "next-auth/providers/notion";
...
providers: [
  NotionProvider({
    clientId: process.env.NOTION_CLIENT_ID,
    clientSecret: process.env.NOTION_CLIENT_SECRET
  })
]
...
```