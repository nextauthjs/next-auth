---
id: mongodb
title: MongoDB
---

The schema generated for a MySQL database when using the built-in models.

:::note
When using MySQL the timezone is set to `Z` (aka Zulu time / UTC / GMT) in the adapter and all timestamps on all models are stored in UTC.
:::

MongoDB does not use schemas in the same way as most RDBMS databases, but the objects stored in MongoDB use similar datatypes to SQL, with some differences:

* ID fields are of type `ObjectID` rather than `int`
* By convention all collection names and object properties are `camelCase` rather than `snake_case`
* A sparse index is used on the User `email` property to allow it to not be specified, while enforcing uniqueness if it is - this ensures it is functionally equivalent to the ANSI SQL behaviour for a `unique` but `nullable` property
* All timestamps are stored as `ISODate()` in MongoDB, all timestamps on all models are stored in UTC (aka Zulu time)
