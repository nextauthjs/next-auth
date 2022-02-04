---
id: mongodb
title: MongoDB
---

MongoDB is a document database and does not use schemas in the same way as most RDBMS databases.

**In MongoDB as collections and indexes are created automatically.**

## Objects in MongoDB

Objects stored in MongoDB use similar datatypes to SQL, with some differences:

1. ID fields are of type `ObjectID` rather than type `int`.

2. All collection names and property names use `camelCase` rather than `snake_case`.

3. All timestamps are stored as `ISODate()` in MongoDB and all date/time values are stored in UTC.

4. A sparse index is used on the User `email` property to allow it to be optional, while still enforcing uniqueness if it is specified.

This is functionally equivalent to the ANSI SQL behaviour for a `unique` but `nullable` property.
