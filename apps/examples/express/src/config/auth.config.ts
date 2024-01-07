import Credentials from "@auth/core/providers/credentials"
import GitHub from "@auth/core/providers/github"
import Google from "@auth/core/providers/google"

export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "jsmith",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const name = credentials.username as string
        // Provide your own logic here to validate credentials
        const user = {
          id: "1",
          name,
          email: name.replace(" ", "") + "@example.com",
        }

        return user
      },
    }),
  ],
}
