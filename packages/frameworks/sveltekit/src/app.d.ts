// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}

declare module '$env/static/private' {
	export const AUTH_SECRET: string
}
declare module '$env/static/public' {
	export const PUBLIC_NEXTAUTH_URL: string
	export const VERCEL: string
	export const AUTH_TRUST_HOST: string
}