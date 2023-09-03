import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface ClickUpProfile {
    user: {
        id: number;
        username: string;
        color: string;
        profilePicture: string;
    }
}

export default function ClickUp(
    config: OAuthUserConfig<ClickUpProfile>
): OAuthConfig<ClickUpProfile>{

    return {
        id: 'clickup',
        name: 'ClickUp',
        type: 'oauth',
        authorization: 'https://app.clickup.com/api',
        token: 'https://api.clickup.com/api/v2/oauth/token',
        userinfo: 'https://api.clickup.com/api/v2/user',
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        checks: ['state'],
        profile: (profile: ClickUpProfile) => {
            return {
                id: profile.user.id.toString(),
                name: profile.user.username,
                profilePicture: profile.user.profilePicture,
                color: profile.user.color
            }
        },
        style: {
            logo: "/click-up.svg",
            logoDark: "/click-up.svg",
            bg: "#fff",
            bgDark: "#24292f",
            text: "#000",
            textDark: "#fff",
          },
          options: config,
    }
}