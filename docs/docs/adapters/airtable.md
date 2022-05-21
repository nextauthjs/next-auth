---
id: airtable
title: Airtable
---

# Airtable

This is the Airtable adapter for next-auth. This package can only be used in conjunction with the primary next-auth package. It is not a standalone package.

## Warning

Using Airtable as a back end for authentication data is a fast way to stand up a site for testing ideas, but is probably not ideal for long term production use.

## Usage

1. Install the necessary packages

```bash npm2yarn
npm install next-auth @next-auth/airtable-adapter
```

2. Set up Airtable

- Clone this base: https://airtable.com/shr16Xd8glUk90c4P (click "Copy Base" in the upper right). You will be prompted to create an account if you don't have one.
- Once you have a copy of the base, get the base id of your copy from the URL (first URL segment starting with `app`)
- Get your API key from [your account page](https://airtable.com/account)

3. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```js
import NextAuth from "next-auth"
import { AirtableAdapter } from "@next-auth/airtable-adapter"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  adapter: AirtableAdapter({
    apiKey: 'key...'
    baseId: 'app...'
  }),
  ...
})
```
