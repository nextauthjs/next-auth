---
id: typeorm-custom-models
title: Custom models with TypeORM
---

NextAuth.js provides a set of [models and schemas](/schemas/models) for the built-in TypeORM adapter that you can easily extend.

You can use these models with MySQL, MariaDB, Postgres, MongoDB and SQLite.

## Creating custom models

```js title="models/User.js"
import adapter from "@next-auth/typeorm-legacy-adapter"

// Extend the built-in models using class inheritance
export default class User extends adapter.Models.User.model {
  // You can extend the options in a model but you should not remove the base
  // properties or change the order of the built-in options on the constructor
  constructor(profile) {
    super(profile)
    // Add custom fields to the User model
    this.firstName = profile?.firstName
    this.lastName = profile?.lastName
    this.userType = profile?.userType
    this.phoneNumber = profile?.phoneNumber
  }
}

export const UserSchema = {
  name: "User",
  target: User,
  columns: {
    ...adapter.Models.User.schema.columns,
    // Add custom fields to the User schema
    firstName: {
      type: "varchar",
      nullable: true,
    },
    lastName: {
      type: "varchar",
      nullable: true,
    },
    userType: {
      type: "varchar",
      nullable: true,
    },
    phoneNumber: {
      type: "varchar",
      nullable: true,
    },
  },
}
```

```js title="models/index.js"
// To make importing them easier, you can export all models from single file
import User, { UserSchema } from "./User"

export default {
  User: {
    model: User,
    schema: UserSchema,
  },
}
```

:::note
[View source for built-in TypeORM models and schemas](https://github.com/nextauthjs/adapters/tree/canary/packages/typeorm-legacy/src/models)
:::

## Using custom models

You can use custom models by specifying the TypeORM adapter explicitly and passing them as an option.

```js title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import adapter from "@next-auth/typeorm-legacy-adapter"

import Models from "../../../models"

export default NextAuth({
  providers: [
    // Your providers
  ],

  adapter: adapter.Adapter(
    // The first argument should be a database connection string or TypeORM config object
    "mysql://username:password@127.0.0.1:3306/database_name",
    // The second argument can be used to pass custom models and schemas
    {
      models: {
        User: Models.User,
      },
    }
  ),
})
```

## Adding custom fields from Providers

You can adjust the shape of the profile that is passed to the custom `User` model with the providers `profile` method.

```js title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import Providers from "next-auth/providers"

export default NextAuth({
  providers: [
    Providers.LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      profileUrl:
        "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName)",
      //
      profile: (profile, tokens) => {
        return {
          id: profile.id,
          name: profile.localizedFirstName + " " + profile.localizedLastName,
          email: null,
          image: null,
          // custom fields
          firstName: profile.localizedFirstName,
          lastName: profile.localizedLastName,
        }
      },
    }),
  ],
})
```
