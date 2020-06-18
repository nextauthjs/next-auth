---
id: postgres
title: Postgres Schema
---

The schema generated for a Postgres database when using the built-in models.

## User

```json
"users": {
  "id": {
    "type": "integer",
    "nullable": false
  },
  "name": {
    "type": "character varying",
    "nullable": true,
    "default": null
  },
  "email": {
    "type": "character varying",
    "nullable": true,
    "default": null
  },
  "email_verified": {
    "type": "timestamp without time zone",
    "nullable": true,
    "default": null
  },
  "image": {
    "type": "character varying",
    "nullable": true,
    "default": null
  },
  "created": {
    "type": "timestamp without time zone",
    "nullable": false
  },
  "updated": {
    "type": "timestamp without time zone",
    "nullable": false
  }
}
```

## Account

```json
"accounts": {
  "id": {
    "type": "integer",
    "nullable": false
  },
  "compound_id": {
    "type": "character varying",
    "nullable": false
  },
  "user_id": {
    "type": "integer",
    "nullable": false
  },
  "provider_type": {
    "type": "character varying",
    "nullable": false
  },
  "provider_id": {
    "type": "character varying",
    "nullable": false
  },
  "provider_account_id": {
    "type": "character varying",
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
    "type": "timestamp without time zone",
    "nullable": true,
    "default": null
  },
  "created": {
    "type": "timestamp without time zone",
    "nullable": false
  },
  "updated": {
    "type": "timestamp without time zone",
    "nullable": false
  }
}
```

## Session

```json
"sessions": {
  "id": {
    "type": "integer",
    "nullable": false
  },
  "user_id": {
    "type": "integer",
    "nullable": false
  },
  "expires": {
    "type": "timestamp without time zone",
    "nullable": false
  },
  "session_token": {
    "type": "character varying",
    "nullable": false
  },
  "access_token": {
    "type": "character varying",
    "nullable": false
  },
  "created": {
    "type": "timestamp without time zone",
    "nullable": false
  },
  "updated": {
    "type": "timestamp without time zone",
    "nullable": false
  }
}
```

## Verification Request

```json
"verification_requests": {
  "id": {
    "type": "integer",
    "nullable": false
  },
  "identifier": {
    "type": "character varying",
    "nullable": false
  },
  "token": {
    "type": "character varying",
    "nullable": false
  },
  "expires": {
    "type": "timestamp without time zone",
    "nullable": false
  },
  "created": {
    "type": "timestamp without time zone",
    "nullable": false
  },
  "updated": {
    "type": "timestamp without time zone",
    "nullable": false
  }
}
```
