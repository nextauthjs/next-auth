import type { OAuthConfig, OAuthUserConfig } from ".";

export interface Person extends Record<string, any> {
	email: string;
}

// https://developers.notion.com/reference/user
export interface User extends Record<string, any> {
	object: "user" | "bot";
	id: string;
	type: string;
	name: string;
	avatar_url: null | string;
	person: Person;
	owner?: {
		type: "workspace" | "user";
		workspace: string;
	};
	workspace_name?: string | null;
}

export type Owner = {
	type: string;
	user: User;
};

// Notion responds with an access_token + some additional information, which we define here
// More info -  https://developers.notion.com/docs/authorization#step-4-notion-responds-with-an-access_token-and-some-additional-information
export interface NotionProfile extends Record<string, any> {
	access_token: string;
	bot_id: string;
	duplicated_template_id: string;
	owner?: Owner;
	workspace_icon: string;
	workspace_id: number;
	workspace_name: string;
}

// Any config required that isn't part of the `OAuthUserConfig` spec should belong here
// For example, we must pass a `redirectUri` to the Notion API when requesting tokens, therefore we add it here
interface AdditionalConfig {
	redirectUri: string;
}

const NOTION_HOST = "https://api.notion.com";
const NOTION_API_VERSION = "2022-06-28";


export default function NotionProvider<P extends NotionProfile>(
	options: OAuthUserConfig<P> & AdditionalConfig
): OAuthConfig<P> {
	return {
		id: "notion",
		name: "Notion",
		type: "oauth",
		token: {
			params: {
				grant_type: "authorization_code",
				clientId: options.clientId,
				clientSecret: options.clientSecret,
			},
			url: `${NOTION_HOST}/v1/oauth/token`,
		},
		userinfo: {
			url: `${NOTION_HOST}/v1/users`,

			// The result of this method will be the input to the `profile` callback. 
			// We use a custom request handler, since we need to do things such as pass the "Notion-Version" header
			// More info: https://next-auth.js.org/configuration/providers/oauth
			async request(context) {
				const profile = await fetch(`${NOTION_HOST}/v1/users/me`, {
					headers: {
						Authorization: `Bearer ${context.tokens.access_token}`,
						"Notion-Version": NOTION_API_VERSION,
					},
				});

				const {
					bot: {
						owner: { user },
					},
				} = await profile.json();

				return user;
			},
		},
		authorization: {
			params: {
				client_id: options.clientId,
				response_type: "code",
				owner: "user",
				redirect_uri: options.redirectUri,
			},
			url: `${NOTION_HOST}/v1/oauth/authorize`,
		},

		async profile(profile, tokens) {
			return {
				id: profile.id,
				name: profile.name,
				email: profile.person.email,
				image: profile.avatar_url,
			};
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
	};
}