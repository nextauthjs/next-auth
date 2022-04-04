export default function Notion(options) {
    const {
        clientId = "",
        clientSecret = "",
        notionVersion = "2022-02-22"
    } = options

    return {
        id: "notion",
        name: "Notion",
        type: "oauth",
        clientId,
        clientSecret,
        authorization: {
            url: "https://api.notion.com/v1/oauth/authorize",
            params: {
                response_type: "code",
                owner: "user",
            },
        },
        token: {
            request: async (context) => {
                if (!context.params.code)
                    throw new Error("No code returned by notion server");

                const payload = JSON.stringify({
                    grant_type: "authorization_code",
                    code: context.params.code,
                    redirect_uri: context.provider.callbackUrl,
                });

                const res = await fetch("https://api.notion.com/v1/oauth/token", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization:
                            "Basic " +
                            btoa(
                                process.env.NOTION_CLIENT_ID +
                                ":" +
                                process.env.NOTION_CLIENT_SECRET
                            ),
                    },
                    body: payload,
                });

                if (res.ok) {
                    const result = await res.json();
                    return { tokens: result };
                }

                throw new Error(
                    "Something went wrong while trying to get the access_token"
                );
            }
        },
        userinfo: {
            request: async ({ tokens }) => {
                const { access_token = "" } = tokens;
                if (!access_token) throw new Error("Access token is missing");

                const res = await fetch(
                    "https://api.notion.com/v1/users/" + tokens.owner.user.id,
                    {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            "Notion-Version": notionVersion,
                            Authorization: "Bearer " + access_token,
                        },
                    }
                );

                if (res.ok) {
                    const json = await res.json();
                    return json;
                }

                throw new Error("Something went wrong while trying to get the user");
            },
        },
        profile: (profile) => {
            return {
                id: profile.id,
                name: profile.name,
                email: profile.person.email,
                image: profile.avatar_url,
            };
        },
        ...options,
    }
}