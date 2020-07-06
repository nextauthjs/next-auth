---
id: custom-typeorm-models
title: Custom TypeORM Models
---

## Using Custom TypeORM Models

NextAuth.js provides TypeORM models based on [the default tables](https://next-auth.js.org/schemas/models).

You can pass in models extending the defaults by specifying the `models` property on your `adapter` configuration object as the second parameter.

```js title="api/auth/[...nextauth].js"
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";

import Models from "../../../models";

const options = {
  providers: [
    // your providers
  ],

  adapter: Adapters.TypeORM.Adapter(
    {
      // first argument are your database options
      database: "your-database-string",
    },
    {
      // second argument are your custom adapter options
      models: {
        User: Models.User,
      },
    }
  ),
};

export default (req, res) => NextAuth(req, res, options);
```

```js title="models/User.js"
import Adapters from "next-auth/adapters";

// you can also just re export the default model
export default class User extends Adapters.TypeORM.Models.User.model {
  // default required fields for the model
  constructor(name, email, image, emailVerified) {
    super(name, email, image, emailVerified);
  }
}

export const UserSchema = {
  name: "User",
  target: User,
  columns: {
    // we're extending the default columns here
    ...Adapters.TypeORM.Models.User.schema.columns,
    phoneNumber: {
      type: "varchar",
      nullable: true,
    },
  },
};
```

```js title="models/index.js"
// we're following the same structure as NextAuth.js
import User, { UserSchema } from "./User";

export default {
  User: {
    model: User,
    schema: UserSchema,
  },
};
```

:::note
You can find all the default models [here](https://github.com/iaincollins/next-auth/tree/main/src/adapters/typeorm/models)
:::
