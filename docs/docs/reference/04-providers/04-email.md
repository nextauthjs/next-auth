---
title: Email Provider options
sidebar_label: Email options
---

|          Name           |                                     Description                                     |               Type               | Required |
| :---------------------: | :---------------------------------------------------------------------------------: | :------------------------------: | :------: |
|           id            |                             Unique ID for the provider                              |             `string`             |   Yes    |
|          name           |                          Descriptive name for the provider                          |             `string`             |   Yes    |
|          type           |                       Type of provider, in this case `email`                        |            `"email"`             |   Yes    |
|         server          |                     Path or object pointing to the email server                     |       `string` or `Object`       |   Yes    |
| sendVerificationRequest |               Callback to execute when a verification request is sent               | `(params) => Promise<undefined>` |   Yes    |
|          from           |   The email address from which emails are sent, default: "<no-reply@example.com>"   |             `string`             |    No    |
|         maxAge          | How long until the e-mail can be used to log the user in seconds. Defaults to 1 day |             `number`             |    No    |

See our guides on magic links authentication for further tips on how to customize this provider:

- [Tutorial](/getting-started/email-tutorial)
- [Guide deep-dive](guides/providers/email)
