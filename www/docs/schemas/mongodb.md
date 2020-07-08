---
id: mongodb
title: MongoDB
---

MongoDB is a document database and does not use schemas in the same way as most RDBMS databases.

However, objects stored in MongoDB use similar datatypes to SQL, with some differences.

* ID fields are of type `ObjectID` rather than type `int`.
* All collection names and property names use `camelCase` rather than `snake_case`.
* All timestamps are stored as `ISODate()` in MongoDB and all date/time values are stored in UTC.
* A sparse index is used on the User `email` property to allow it to not be specified, while still enforcing uniqueness if it is present on a User object.

  This ensures the behaviour functionally equivalent to the ANSI SQL behaviour for a `unique` but `nullable` property, so that it works the same way as the MySQL and Postgres schemas.
