import type { OAuthConfig, OAuthUserConfig } from "."

export interface NotionProfile extends Record<string, any> {
	object: string
	id: string
	name: string
	avatar_url: string
	type: string
	person: {
		email: string
	}
}

export default function Notion<P extends NotionProfile>(
	options: OAuthUserConfig<P>
): OAuthConfig<P> {
	return {
		id: "notion",
		name: "Notion",
		type: "oauth",
		authorization: "https://api.notion.com/v1/oauth/authorize",
		token: "https://api.notion.com/v1/oauth/token",
		userinfo: {
			async request({ tokens }) {
				const res = await fetch("https://api.notion.com/v1/users/me", {
					headers: {
						Authorization: `Bearer ${tokens.access_token}`,
						"Notion-Version": "2022-06-28",
					},
				})

				const {
					bot: {
						owner: { user },
					},
				} = await res.json()
				return user
			},
		},
		profile(profile) {
			return {
				id: profile.id,
				name: profile.name,
				email: profile.person.email,
				image: profile.avatar_url,
			}
		},
		style: {
			logo: "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/notion.svg",
			logoDark:
				"https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/notion.svg",
			bg: "#fff",
			text: "#000",
			bgDark: "#fff",
			textDark: "#000",
		},
		options,
	}
}
