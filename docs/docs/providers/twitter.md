---
id: twitter
title: Twitter
---

Twitter provider supports both OAuth 1.0 (legacy) and OAuth 2.0. OAuth 1.0 provides `oauth_token` and `oauth_token_secret`, while OAuth 2.0 provides `access_token` and `refresh_token`. Remember to add the appropriate tokens to your database schema if you are using an [Adapter](https://authjs.dev/getting-started/database).

## Documentation
https://developer.twitter.com

## Configuration
https://developer.twitter.com/en/apps

## Options
The **Twitter Provider** comes with a set of default options:
- [Twitter Provider options](https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/providers/twitter.ts)

You can override any of the options to suit your own use case.

## Example

### OAuth 1.0 (Legacy)
```js
import TwitterProvider from "next-auth/providers/twitter";
...
providers: [
  TwitterProvider({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET
  })
]
...
```

:::tip
You must enable the *"Request email address from users"* option in your app permissions if you want to obtain the users email address.
:::

![twitter](https://user-images.githubusercontent.com/55143799/168702338-a95912a7-b689-4680-aa2c-6306fe3c2ec7.jpeg)

## OAuth 2.0

Twitter supports OAuth 2.0, which provides better security and more granular permissions through scopes. To enable it, add `version: "2.0"` to your Provider configuration:

### Basic OAuth 2.0 Configuration
```js
TwitterProvider({
  clientId: process.env.TWITTER_CLIENT_ID,
  clientSecret: process.env.TWITTER_CLIENT_SECRET,
  version: "2.0",
})
```

### Advanced OAuth 2.0 Configuration with Scopes
```js
TwitterProvider({
  clientId: process.env.TWITTER_CLIENT_ID,
  clientSecret: process.env.TWITTER_CLIENT_SECRET,
  version: "2.0",
  authorization: {
    url: "https://twitter.com/i/oauth2/authorize",
    params: {
      scope: "users.read tweet.read offline.access",
    },
  },
  token: "https://api.twitter.com/2/oauth2/token",
  userinfo: {
    url: "https://api.twitter.com/2/users/me",
    params: {
      "user.fields": "id,name,username,profile_image_url,public_metrics,verified",
    },
  },
  profile(profile) {
    return {
      id: profile.data.id,
      name: profile.data.name,
      username: profile.data.username,
      email: profile.data.email, // May be undefined
      image: profile.data.profile_image_url,
      verified: profile.data.verified,
    };
  },
})
```

### Available OAuth 2.0 Scopes

Twitter OAuth 2.0 supports granular permissions through scopes:

#### Basic Scopes
- `users.read` - Read user profile information
- `tweet.read` - Read tweets
- `offline.access` - Get refresh token for long-term access

#### Extended Scopes
- `tweet.write` - Post tweets
- `tweet.moderate.write` - Hide/unhide replies
- `follows.read` - Read following/followers lists
- `follows.write` - Follow/unfollow users
- `like.read` - Read liked tweets
- `like.write` - Like/unlike tweets
- `list.read` - Read lists
- `list.write` - Create/manage lists
- `space.read` - Read Twitter Spaces
- `mute.read` - Read muted users
- `mute.write` - Mute/unmute users
- `block.read` - Read blocked users
- `block.write` - Block/unblock users

#### Example Scope Combinations
```js
// Basic read access
scope: "users.read tweet.read offline.access"

// Read and write tweets
scope: "users.read tweet.read tweet.write offline.access"

// Full social features
scope: "users.read tweet.read follows.read follows.write like.read like.write offline.access"

// With email (requires elevated access)
scope: "users.read user.read:email tweet.read offline.access"
```

## Important Notes

### OAuth 2.0 Considerations
- **Email Access**: Email is not always provided by Twitter OAuth 2.0. For basic access, email may be undefined
- **Elevated Access Required**: To access email and some advanced features, you need to apply for elevated access in the Twitter Developer Portal
- **User Fields**: You can customize which user fields to retrieve using the `user.fields` parameter
- **Credentials**: Make sure you're using the **OAuth 2.0 Client ID and Secret** from your Twitter app, not the API Key and Secret

### Handling Users Without Email

When using OAuth 2.0, your application should handle cases where Twitter doesn't provide an email:

```js
// In your signIn callback
async signIn({ user, account, profile }) {
  if (account?.provider === "twitter" && !user.email) {
    // Handle Twitter users without email
    // You can create users with username or Twitter ID instead
    console.log('Twitter user without email:', user.username);
  }
  return true;
}
```

### Twitter App Configuration

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/apps)
2. Create or edit your app
3. For OAuth 2.0:
   - Enable OAuth 2.0 in app settings
   - Set callback URL: `https://yourdomain.com/api/auth/callback/twitter`
   - Configure app permissions and scopes
   - Use the **OAuth 2.0 Client ID and Secret** in your environment variables

Keep in mind that although switching to OAuth 2.0 is straightforward, it changes how and with which [Twitter APIs](https://developer.twitter.com/en/docs/api-reference-index) you can interact. Read the official [Twitter OAuth 2.0 documentation](https://developer.twitter.com/en/docs/authentication/oauth-2-0) for more details.
