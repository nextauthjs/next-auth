---
id: apple
title: Apple
---

This is a placeholder and needs to be refactored before it can be pubished.

## Instructions

To test you must secure your local development server. (next-auth-example). Apple doesn't allow for localhost in domains or subdomains.

I refactored the code and removed the option "oauth-apple"

How to:
https://medium.com/@anMagpie/secure-your-local-development-server-with-https-next-js-81ac6b8b3d68

Edit your hostfile and create a fake domain:

127.0.0.1 dev.iaincollins.io

This documentation could be simplified but for the most part I followed: (Creating Apple Services IDs)
https://developer.okta.com/blog/2019/06/04/what-the-heck-is-sign-in-with-apple

The tricky part after that is creating the secret. The two things that tripped me up were:

TeamID and the KeyID.

The TeamID is located on the top right after logging in.
The KeyID is located after you create the Key look for before you download the k8 file.

APPLE_ID=dev.iaincollins.io
APPLE_SECRET=**GENERATED_JWT_TOKEN_FROM_CODE_ABOVE**

## Example

Providers.Apple({
  clientId: process.env.APPLE_ID,
  clientSecret: { 
    appleId: process.env.APPLE_ID,
    teamId: process.env.APPLE_TEAM_ID,
    privateKey: process.env.APPLE_PRIVATE_KEY,
    keyId: process.env.APPLE_KEY_ID,
  }
}),

 clientSecretCallback: ({appleId, keyId, teamId, privateKey}) => {
      const claims = {
        iss: teamId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + ( 86400 * 180 ), // 6 months
        aud: 'https://appleid.apple.com',
        sub: appleId
      }
    
      return jwt.sign(claims, privateKey, {
        algorithm: 'ES256',
        keyid
      })
  })

  ## HTTPS Server Example

  
const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./certificates/localhost.key'),
  cert: fs.readFileSync('./certificates/localhost.crt')
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
    
  }).listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on https://localhost:3000');
  });