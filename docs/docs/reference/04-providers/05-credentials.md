---
title: Credentials Provider options
sidebar_label: Credentials options
---

|    Name     |                    Description                    |                 Type                  | Required |
| :---------: | :-----------------------------------------------: | :-----------------------------------: | :------: |
|     id      |            Unique ID for the provider             |               `string`                |   Yes    |
|    name     |         Descriptive name for the provider         |               `string`                |   Yes    |
|    type     |   Type of provider, in this case `credentials`    |            `"credentials"`            |   Yes    |
| credentials |          The credentials to sign-in with          |               `Object`                |   Yes    |
|  authorize  | Callback to execute once user is to be authorized | `(credentials, req) => Promise<User>` |   Yes    |
