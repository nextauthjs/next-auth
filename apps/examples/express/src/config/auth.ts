import CredentialsProvider from "@auth/core/providers/credentials"
export const authConfig = {
  providers: [
    CredentialsProvider({
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
        const name = (credentials.username as string) || "John Smith"
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
