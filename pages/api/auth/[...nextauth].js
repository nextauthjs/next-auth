import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    Providers.Auth0({
      clientId: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      domain: process.env.AUTH0_DOMAIN,
      protection: 'pkce'
    }),
    Providers.Twitter({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET
    }),
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        password: { label: 'Password', type: 'password' }
      },
      async authorize (credentials) {
        if (credentials.password === 'password') {
          return {
            id: 1,
            name: 'Fill Murray',
            email: 'bill@fillmurray.com',
            image: 'https://www.fillmurray.com/64/64'
          }
        }
        return null
      }
    })
  ],
  jwt: {
    encryption: true,
    secret: process.env.SECRET
  },
  debug: false
})
