<p align="center">
   <br/>
   <a href="https://next-auth.js.org" target="_blank"><img height="64px" src="https://next-auth.js.org/img/logo/logo-sm.png" /></a>&nbsp;&nbsp;&nbsp;&nbsp;<img height="64px" src="https://raw.githubusercontent.com/nextauthjs/adapters/main/packages/dynamodb/logo.png" />
   <h3 align="center"><b>DynamoDB Adapter</b> - NextAuth.js</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <img src="https://github.com/nextauthjs/adapters/actions/workflows/release.yml/badge.svg" alt="Build Test" />
      <img src="https://img.shields.io/bundlephobia/minzip/@next-auth/dynamodb-adapter/latest" alt="Bundle Size"/>
      <img src="https://img.shields.io/npm/v/@next-auth/dynamodb-adapter" alt="@next-auth/dynamodb-adapter Version" />
   </p>
</p>

## Overview

This is the AWS DynamoDB Adapter for next-auth. This package can only be used in conjunction with the primary next-auth package. It is not a standalone package.

You need a table with a partition key `pk` and a sort key `sk`. Your table also needs a global secondary index named `GSI1` with `GSI1PK` as partition key and `GSI1SK` as sorting key. You can set whatever you want as the table name and the billing method.

If you want sessions and verification tokens to get automatically removed from your table you need to [activate TTL](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html) on your table with the TTL attribute name set to `expires`

You can find the DynamoDB schema in the docs at [next-auth.js.org/adapters/dynamodb](https://next-auth.js.org/adapters/dynamodb).

## Getting Started

1. Install `next-auth` and `@next-auth/dynamodb-adapter`

```js
npm install next-auth @next-auth/dynamodb-adapter
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

You need to pass `DocumentClient` instance from `aws-sdk` to the adapter.
The default table name is `next-auth`, but you can customise that by passing `{ tableName: 'your-table-name' }` as the second parameter in the adapter.

```js
import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter"

const config: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY as string,
  },
  region: process.env.NEXT_AUTH_AWS_REGION,
};

const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
})

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    // ...add more providers here
  ],
  adapter: DynamoDBAdapter(
    client
  ),
  ...
});
```

(AWS secrets start with `NEXT_AUTH_` in order to not conflict with [Vercel's reserved environment variables](https://vercel.com/docs/environment-variables#reserved-environment-variables).)

## Table structure

The table respects the single table design pattern. This has many advantages:

- Only one table to manage, monitor and provision.
- Querying relations is faster than with multi-table schemas (for eg. retreiving all sessions for a user).
- Only one table needs to be replicated, if you want to go multi-region.

Here is a schema of the table :

<p align="center">
    <img src="https://i.imgur.com/hGZtWDq.png" alt="">
</p>

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please read our [Contributing Guide](https://github.com/nextauthjs/adapters/blob/main/CONTRIBUTING.md).

## License

ISC
