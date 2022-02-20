import NextAuth from '$lib/next-auth';
import type { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

const nextAuthOptions: NextAuthOptions = {
	providers: [
		GithubProvider({
			clientId: import.meta.env.VITE_GITHUB_CLIENT_ID as string,
			clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET as string
		})
	]
};

export const { get, post } = NextAuth(nextAuthOptions);
