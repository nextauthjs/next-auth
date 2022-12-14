---
title: Built-in OAuth providers
---

NextAuth.js comes with a set of built-in providers. You can find them [here](https://github.com/nextauthjs/next-auth/tree/main/src/providers). Each built-in provider has its own documentation page:

<div className="provider-name-list">
{Object.entries(require("../../../providers.json")) .filter(([key]) => !["email", "credentials"].includes(key)) .sort(([, a], [, b]) => a.localeCompare(b)) .map(([key, name]) => ( {name} , ) )}
</div>
