---
id: atlassian
title: Atlassian
---

## Documentation

https://developer.atlassian.com/cloud/jira/platform/oauth-2-authorization-code-grants-3lo-for-apps/#implementing-oauth-2-0--3lo-

## Example

For Jira Platform API access:

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Atlassian({
    clientId: process.env.ATLASSIAN_CLIENT_ID,
    clientSecret: process.env.ATLASSIAN_CLIENT_SECRET,
      scope:
        'write:jira-work read:jira-work read:jira-user offline_access read:me',
  })
}
...
```

## Instructions

### Configuration

:::tip
An app can be created at https://developer.atlassian.com/apps/
:::

Under "Apis and features" side menu, configure the following for the "OAuth 2.0 (3LO)"

- Redirect URL
  - http://localhost:3000/api/auth/callback/atlassian

:::warning
To enable access to Jira Platform REST API you must enable User Identity API and add `read:me` to your provider scope option.
:::
