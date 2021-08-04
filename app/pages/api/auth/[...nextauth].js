import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GitHubProvider from "next-auth/providers/github"
import Auth0Provider from "next-auth/providers/auth0"
import TwitterProvider from "next-auth/providers/twitter"
import CredentialsProvider from "next-auth/providers/credentials"
import IDS4Provider from "next-auth/providers/identity-server4"
import Twitch from "next-auth/providers/twitch"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import FoursquareProvider from "next-auth/providers/foursquare"
// import FreshbooksProvider from "next-auth/providers/freshbooks"
import GitlabProvider from "next-auth/providers/gitlab"
import InstagramProvider from "next-auth/providers/instagram"
import LineProvider from "next-auth/providers/line"
import LinkedInProvider from "next-auth/providers/linkedin"
import MailchimpProvider from "next-auth/providers/mailchimp"
import DiscordProvider from "next-auth/providers/discord"

export default NextAuth({
  providers: [
    // E-mail
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    // Credentials
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials.password === "password") {
          return {
            id: 1,
            name: "Fill Murray",
            email: "bill@fillmurray.com",
            image: "https://www.fillmurray.com/64/64",
          }
        }
        return null
      },
    }),
    // OAuth 1
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
    }),
    // OAuth 2 / OIDC
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Auth0Provider({
      clientId: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      issuer: process.env.AUTH0_ISSUER,
    }),
    Twitch({
      clientId: process.env.TWITCH_ID,
      clientSecret: process.env.TWITCH_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    FoursquareProvider({
      clientId: process.env.FOURSQUARE_ID,
      clientSecret: process.env.FOURSQUARE_SECRET,
    }),
    // FreshbooksProvider({
    //   clientId: process.env.FRESHBOOKS_ID,
    //   clientSecret: process.env.FRESHBOOKS_SECRET,
    // }),
    GitlabProvider({
      clientId: process.env.GITLAB_ID,
      clientSecret: process.env.GITLAB_SECRET,
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_ID,
      clientSecret: process.env.INSTAGRAM_SECRET,
    }),
    LineProvider({
      clientId: process.env.LINE_ID,
      clientSecret: process.env.LINE_SECRET,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_ID,
      clientSecret: process.env.LINKEDIN_SECRET,
    }),
    MailchimpProvider({
      clientId: process.env.MAILCHIMP_ID,
      clientSecret: process.env.MAILCHIMP_SECRET,
    }),
    IDS4Provider({
      clientId: process.env.IDS4_ID,
      clientSecret: process.env.IDS4_SECRET,
      issuer: process.env.IDS4_ISSUER,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
    }),
  ],
  jwt: {
    encryption: true,
    secret: process.env.SECRET,
  },
  debug: true,
  theme: "auto",
})
