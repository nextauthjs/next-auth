---
id: todoist
title: Todoist
---

## Documentation

https://developer.todoist.com/guides/#oauth

## Configuration

https://developer.todoist.com/appconsole.html

## Options

The **Todoist Provider** comes with a set of default options:

- [Todoist Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/todoist.ts)

You can override any of the options to suit your own use case.

## Example

```js
import TodoistProvider from "next-auth/providers/todoist";

...
providers: [
  TodoistProvider({
    clientId: process.env.TODOIST_ID,
    clientSecret: process.env.TODOIST_SECRET
  })
]
...
```
