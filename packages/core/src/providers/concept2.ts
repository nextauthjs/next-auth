import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface Concept2Profile extends Record<string, any> {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    gender: string;
    dob: string;
    email: string;
    country: string;
    profile_image: string;
    age_restricted: boolean;
    email_permission: boolean;
    max_heart_rate: number | null;
};

export default function Concept2<P extends Concept2Profile>(options: OAuthUserConfig<P>): OAuthConfig<P> {
    return {
        id: 'concept2',
        name: 'Concept2',
        type: 'oauth',
        checks: [],
        authorization: {
            url: 'https://log.concept2.com/oauth/authorize',
            params: {
                scope: 'user:read,results:write',
            },
        },
        token: 'https://log.concept2.com/oauth/access_token',
        userinfo: 'https://log.concept2.com/api/users/me',
        profile(profile) {
            return {
                id: profile.data.id,
                name: profile.data.username,
                email: profile.data.email,
                image: profile.data.profile_image,
            };
        },
        options,
    };
}
