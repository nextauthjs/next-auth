import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

// import Adapters from 'next-auth/adapters'
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

export default NextAuth({
  // Used to debug https://github.com/nextauthjs/next-auth/issues/1664
  // cookies: {
  //   csrfToken: {
  //     name: 'next-auth.csrf-token',
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'none',
  //       path: '/',
  //       secure: true
  //     }
  //   },
  //   pkceCodeVerifier: {
  //     name: 'next-auth.pkce.code_verifier',
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'none',
  //       path: '/',
  //       secure: true
  //     }
  //   }
  // },
  providers: [
    Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    Providers.Auth0({
      clientId: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      domain: process.env.AUTH0_DOMAIN,
      // Used to debug https://github.com/nextauthjs/next-auth/issues/1664
      // protection: ["pkce", "state"],
      // authorizationParams: {
      //   response_mode: 'form_post'
      // }
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
  debug: false,
  theme: 'auto'

  // Default Database Adapter (TypeORM)
  // database: process.env.DATABASE_URL

  // Prisma Database Adapter
  // To configure this app to use the schema in `prisma/schema.prisma` run:
  // npx prisma generate
  // npx prisma migrate dev --preview-feature
  // adapter: Adapters.Prisma.Adapter({ prisma })
})
