import NextAuth from '$lib';
import type { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

const nextAuthOptions: NextAuthOptions = {
	providers: [
		GithubProvider({
			clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
			clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET
		})
	]
};

export const { get, post } = NextAuth(nextAuthOptions);
