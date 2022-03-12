import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

/** @type {import("next-auth").NextAuthOptions} */
export const authConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        Password: { placeholder: `type "password"`, type: "password" },
      },
      authorize(credentials) {
        if (credentials.Password === "password") {
          return {
            name: "John Doe",
            email: "john@doe.com",
            image: "https://www.fillmurray.com/200/200",
          }
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  theme: {
    logo: "https://www.gatsbyjs.com/Gatsby-Monogram.svg",
    colorScheme: "light",
    brandColor: "#663399",
  },
}
