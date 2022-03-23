---
id: corporate-link-checking-email-provider
title: Allow Email Signups Behind Corporate Link Checker
---

If you use Office 365 or Outlook, or potentially other Email systems, you may notice your Email invitation Links not working.

This is because the invitation Email your User is receiving is being scanned by the Email provider. In the specific case of Outlook and their "SafeLink" feature, they send a HEAD request to each link in the Email. This request will trigger the NextAuth.js catch-all API Route with the users invitation token, in effect using it up.

Therefore, when the user wants to use it themselves, and clicks on the invitation link they will be greeted with an error message that the invitation is invalid.

## Workarounds

### Disable "SafeLink"

The first potential workaround is to simply disable this "SafeLink" feature for your organisation. Microsoft has more details on this [here](https://docs.microsoft.com/en-us/microsoft-365/security/office-365-security/safe-links?view=o365-worldwide#do-not-rewrite-the-following-urls-lists-in-safe-links-policies). Obviously this won't be an option for everyone as this is usually a part of corporate IT policy.

### Update NextAuth.js for 'HEAD' requests

The second option is to modify your `[...nextauth].js` catch-all API route a bit to gracefully handle these initial `HEAD` requests from the email service, without accidentally using up the invitation link.

This can be done by simply returning a `200` response on `HEAD` requests at the very top of the API route, before any other logic is executed.

For example

```jsx title="/pages/api/auth/[...nextauth].js"
import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

  if(req.method === "HEAD") {
     return res.status(200)
  }

  ...
}
```

This should allow you to successfully use NextAuth.js's Email provider behind strict corporate IT settings.
