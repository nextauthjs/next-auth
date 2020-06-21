---
id: mysql
title: MySQL Schema
---

The schema generated for a MySQL database when using the built-in models.

:::note
When using MySQL the timezone is set to `Z` (aka Zulu time / UTC / GMT) in the adapter and all timestamps on all models are stored in UTC.
:::

## User

```json
"users": {
  "id": {
    "type": "int",
    "nullable": false
  },
  "name": {
    "type": "varchar(255)",
    "nullable": true,
    "default": null
  },
  "email": {
    "type": "varchar(255)",
    "nullable": true,
    "default": null
  },
  "email_verified": {
    "type": "timestamp",
    "nullable": true,
    "default": null
  },
  "image": {
    "type": "varchar(255)",
    "nullable": true,
    "default": null
  },
  "created_at": {
    "type": "timestamp(6)",
    "nullable": false
  },
  "updated_at": {
    "type": "timestamp(6)",
    "nullable": false
  }
}
```

## Account

```json
"accounts": {
  "id": {
    "type": "int",
    "nullable": false
  },
  "compound_id": {
    "type": "varchar(255)",
    "nullable": false
  },
  "user_id": {
    "type": "int",
    "nullable": false
  },
  "provider_type": {
    "type": "varchar(255)",
    "nullable": false
  },
  "provider_id": {
    "type": "varchar(255)",
    "nullable": false
  },
  "provider_account_id": {
    "type": "varchar(255)",
    "nullable": false
  },
  "refresh_token": {
    "type": "text",
    "nullable": true,
    "default": null
  },
  "access_token": {
    "type": "text",
    "nullable": true,
    "default": null
  },
  "access_token_expires": {
    "type": "timestamp",
    "nullable": true,
    "default": null
  },
  "created_at": {
    "type": "timestamp(6)",
    "nullable": false
  },
  "updated_at": {
    "type": "timestamp(6)",
    "nullable": false
  }
}
```

## Session

```json
"sessions": {
  "id": {
    "type": "int",
    "nullable": false
  },
  "user_id": {
    "type": "int",
    "nullable": false
  },
  "expires": {
    "type": "timestamp",
    "nullable": false
  },
  "session_token": {
    "type": "varchar(255)",
    "nullable": false
  },
  "access_token": {
    "type": "varchar(255)",
    "nullable": false
  },
  "created_at": {
    "type": "timestamp(6)",
    "nullable": false
  },
  "updated_at": {
    "type": "timestamp(6)",
    "nullable": false
  }
}
```

## Verification Request

```json
 "verification_requests": {
  "id": {
    "type": "int",
    "nullable": false
  },
  "identifier": {
    "type": "varchar(255)",
    "nullable": false
  },
  "token": {
    "type": "varchar(255)",
    "nullable": false
  },
  "expires": {
    "type": "timestamp",
    "nullable": false
  },
  "created_at": {
    "type": "timestamp(6)",
    "nullable": false
  },
  "updated_at": {
    "type": "timestamp(6)",
    "nullable": false
  }
}
```