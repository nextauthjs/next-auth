import NextAuth from "next-auth"
import Auth0 from "next-auth/providers/github"
import Facebook from "next-auth/providers/facebook"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Twitter from "next-auth/providers/twitter"

export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental,
} = NextAuth({ providers: [GitHub, Auth0, Facebook, Google, Twitter] })
