---
id: providers
title: Providers
---

# Providers

## Supported providers

| Name                 | API docs                                                          | App configuration                | Additional options                                       |  Notes
| :------------------- | :-------------------------------------------------------| :------------------------------------------|:----------------------------------------------|:-------------------------- 
| `Auth0`              |  https://auth0.com/docs/api/authentication#authorize-application			 | https://manage.auth0.com/dashboard| accessTokenUrl, authorizationUrl, profileUrl  | doesn't need clientSecret
| `Discord`            |  https://discord.com/developers/docs/topics/oauth2			 | https://discord.com/developers/applications|
| `Email`              |  https://nodemailer.com/smtp/well-known                 | 																				    |
| `Github`       	     |  https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/                       | https://github.com/settings/apps/    |  |allows only one callback URL       
| `Google`             |  https://developers.google.com/identity                 | https://console.developers.google.com/apis/credentials                                            |
| `Google OAuth2`      |  https://developers.google.com/identity/protocols/oauth2| https://console.developers.google.com/apis/credentials                           |
| `Mixer`              |  https://dev.mixer.com/reference/oauth                  | https://mixer.com/lab/oauth               |
| `Slack`              |  https://api.slack.com                                  | https://api.slack.com/apps                 |
| `Twitch`             |  https://dev.twitch.tv/docs/authentication              | https://dev.twitch.tv/console/apps          |                	
| `Twitter`            |  https://developer.twitter.com                          | https://developer.twitter.com/en/apps       |

## OAuth Configuration

NextAuth supports OAuth 1.0, 1.0A and 2.0 providers.  
Most OAuth providers only need a client ID and a client secret to work but some might need some additional or even less options. You can check these in the list of supported providers. 

### Basics

1. Register your application at the developer portal of your provider. You can follow the links above which provide the documentation on how to set this up.
2. The redirect URI should follow this format:
	```
	[origin]/api/auth/callback/[provider]
	```
	For Twitter on localhost this would be:
	```
	http://localhost:3000/api/auth/callback/twitter
	```
3. Create an .env file to the root of your project and add the client id and client secret. For Twitter this would be:

	```
	TWITTER_ID=YOUR_TWITTER_CLIENT_ID
	TWITTER_SECRET=YOUR_TWITTER_CLIENT_SECRET
	```

4. Now you can add the provider settings to the NextAuth options object. You can add as many OAuth providers as you like. 
	```js title="/pages/api/auth/[...slug].js"
	...
	providers: [
		Providers.Twitter({
			clientId: process.env.TWITTER_ID,
			clientSecret: process.env.TWITTER_SECRET,
		}),
		Providers.Google({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET
		}),
	],
	...
	```
5. You can sign in at `[origin]/api/auth/signin`. This is an unbranded auto-generated page with all the configured providers. If you want to create a custom sign in page you can use `[origin]/api/auth/signin/[provider]` which connects directly to the provider.

### Custom OAuth provider

It's also possible to add an OAuth provider that isn't supported by NextAuth by creating a custom JSON object. Below you can see the configuration for the Google provider.
```
{
	id: 'google',
  name: 'Google',
	type: 'oauth',
	version: '2.0',
	scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
	options: { grant_type: 'authorization_code' },
	accessTokenUrl: 'https://accounts.google.com/o/oauth2/token',
	requestTokenUrl: 'https://accounts.google.com/o/oauth2/auth',
	authorizationUrl: 'https://accounts.google.com/o/oauth2/auth?response_type=code',
	profileUrl: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
	profile: (profile) => {
		return {
			id: profile.id,
			name: profile.name,
			email: profile.email,
			image: profile.picture
		}
	},
	clientId: '',
	clientSecret: ''
}
```
You can replace all the options in this JSON object with the ones from your custom provider and add it to the providers list.

```js title="/pages/api/auth/[...slug].js"
...
providers: [
	Providers.Twitter({
		clientId: process.env.TWITTER_ID,
		clientSecret: process.env.TWITTER_SECRET,
	}),
	{
		id: 'customProvider',
  	name: 'CustomProvider',
  	type: 'oauth',
  	version: '2.0',
		scope: // When configuring OAuth providers you will need to make sure you get permission to request
		...
	}
]
...
```

You can also open a PR for your custom configuration so we can support the provider out of the box 😉

## Email configuration

### Basics

1. Register your app at an email provider. An overview of email providers is available at the email link in the table above.
2. There are two ways to configure the SMTP-server you can either use a connection string or a configuration object.
   
    2.1. Connection string:
		
   Create an .env file to the root of your project and the connection string and email address.
	 ```js title=".env"
	 EMAIL_FROM=noreply@example.com
	 EMAIL_SERVER=smtp://username:password@smtp.example.com:587
	 ```
	 Now you can add the provider settings to the NextAuth options object.

  ```js title="/pages/api/auth/[...slug].js"
	 providers: [
			Providers.Email({
				server: process.env.EMAIL_SERVER, 
				from: process.env.EMAIL_FROM,
			}),
  	],
	 ```

    2.2. Configuration object:
		
   Create an .env file to the root of your project and the configuration object options and email address
	 ```js title=".env"
	 EMAIL_FROM=noreply@example.com
	 EMAIL_SERVER_USER=username
	 EMAIL_SERVER_PASSWORD=password
	 EMAIL_SERVER_HOST=smtp.example.com
	 EMAIL_SERVER_PORT=587
	 ```
	 Now you can add the provider settings to the NextAuth options object.
  ```js title="/pages/api/auth/[...slug].js"
	 providers: [
			Providers.Email({
				server: {
					host: process.env.EMAIL_SERVER_HOST,
					port: process.env.EMAIL_SERVER_PORT,
					auth: {
						user: process.env.EMAIL_SERVER_USER,
						pass: process.env.EMAIL_SERVER_PASSWORD
					}
				}
				from: process.env.EMAIL_FROM,
			}),
  	],
	 ```
3. You can sign in at `[origin]/api/auth/signin`. This is an unbranded auto-generated page with all the configured providers. If you want to create a custom sign in page you can use `[origin]/api/auth/signin/email` which connects directly to the provider.
	

