import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  site: 'http://localhost:3000',

  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
  ],

  // A database is optional, but required to persist accounts in a database
  database: 'sqlite://localhost/:memory:?synchronize=true',
}

export default (req, res) => NextAuth(req, res, options)