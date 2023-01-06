---
id: notion
title: Notion
---

## Documentation

https://developers.notion.com/docs

https://developers.notion.com/docs/authorization

## Configuration

https://www.notion.so/my-integrations

Note: You need to select "Public Integration" on the configuration page to get an `oauth_id` and `oauth_secret`. Private integrations do not provide these details. 

## Options

The **Notion Provider** comes with a set of default options:

- [Notion Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/notion.ts)

You can override any of the options to suit your own use case.

You must provide a `clientId` and `clientSecret` to use this provider, as-well as a redirect URI (due to this being required by Notion endpoint to fetch tokens, this is documented in the [notion provovider](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/notion.ts)).

## Example

```js
import NotionProvider from "next-auth/providers/notion";
...
providers: [
  NotionProvider({
    clientId: process.env.NOTION_CLIENT_ID,
    clientSecret: process.env.NOTION_CLIENT_SECRET
    redirectUri: "http://localhost:3000/api/auth/callback/notion",
  })
],
...
```

## Additional Notes

### Next Auth Database Integration

If you're using the next auth database integration (in this case, we'll be using prisma + sqlite), there are some additional steps to follow.

1. Make sure your `Account` definition contains the extra fields that are returned by the access token endpoint, at time of writing this includes;

```ts
model Account {
  id                     String  @id @default(cuid())
  userId                 String
  type                   String
  provider               String
  providerAccountId      String
  bot_id                 String? // @db.Text
  workspace_name         String? // @db.Text
  workspace_icon         String? // @db.Text
  workspace_id           String? // @db.Text
  duplicated_template_id String? // @db.Text
  refresh_token          String? // @db.Text
  access_token           String? // @db.Text
  expires_at             Int?
  token_type             String?
  scope                  String?
  id_token               String? // @db.Text
  session_state          String?
  user                   User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```


2. If you're using SQLITE, you will find the "owner" returned in the call to fetch access token is JSON, and is not supported for example by SQLITE,
It reccomended you either remove it (as this code does), or you could stringify and store as text if you want

```ts
const adapter = {
  ...PrismaAdapter(prisma),
  linkAccount: ({ owner, ...data }: any) => {
    debugger
    return prisma.account.create({ data })
  },
}

export const authOptions: NextAuthOptions = {
  adapter,
  providers: [
    NotionProvider({
      clientId: env.NOTION_CLIENT_ID,
      clientSecret: env.NOTION_CLIENT_SECRET,
      redirectUri: "http://localhost:3000/api/auth/callback/notion",
    }),
  ],
}

export default NextAuth(authOptions)
```