---
id: typeorm-custom-models
title: Custom models with TypeORM
---

NextAuth.js provides a set of [models and schemas](/schemas/models) for the built-in TypeORM adapter that you can easily extend.

You can use these models with MySQL, MariaDB, Postgres, MongoDB and SQLite.

## Creating custom models

```js title="models/User.js"
import Adapters from "next-auth/adapters"

// Extend the built-in models using class inheritance
export default class User extends Adapters.TypeORM.Models.User.model {
  // You can extend the options in a model but you should not remove the base
  // properties or change the order of the built-in options on the constructor
  constructor(name, email, image, emailVerified) {
    super(name, email, image, emailVerified)
  }
}

export const UserSchema = {
  name: "User",
  target: User,
  columns: {
    ...Adapters.TypeORM.Models.User.schema.columns,
    // Adds a phoneNumber to the User schema
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
[View source for built-in TypeORM models and schemas](https://github.com/iaincollins/next-auth/tree/main/src/adapters/typeorm/models)
:::

## Using custom models

You can use custom models by specifying the TypeORM adapter explicitly and passing them as an option.

```js title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import Adapters from "next-auth/adapters"

import Models from "../../../models"

const options = {
  providers: [
    // Your providers
  ],

  adapter: Adapters.TypeORM.Adapter(
    // The first argument should be a database connection string or TypeORM config object
    "mysql://username:password@127.0.0.1:3306/database_name",
    // The second argument can be used to pass custom models and schemas
    {
      customModels: {
        User: Models.User,
      },
    }
  ),
}

export default (req, res) => NextAuth(req, res, options)
```


