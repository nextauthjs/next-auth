/**
 * <div class="provider" style={{backgroundColor: "#1A1A1A", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>PropelAuth</b> integration.</span>
 * <a href="https://www.propelauth.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/propelauth.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/propelauth
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js";

export interface PropelAuthProfile {
    email: string;
    user_id: string;
    picture_url: string;
    last_active_at: string;
    org_id_to_org_info: Record<string, { org_name: string; user_role: string }>;
}

export default function PropelAuth<P extends PropelAuthProfile>(
    options: OAuthUserConfig<P>
): OAuthConfig<P> {
    const base = options.issuer ?? "https://auth.propelauth.com";
    const oauth = `${base}/propelauth/oauth`;

    return {
        id: "propelauth",
        name: "PropelAuth",
        type: "oauth",
        authorization: `${oauth}/authorize`,
        token: `${oauth}/token`,
        userinfo: `${oauth}/userinfo`,
        issuer: base,
        profile(profile) {
            return {
                id: profile.user_id,
                email: profile.email,
                image: profile.picture_url,
                name: profile.email,
                orgs: Object.values(profile.org_id_to_org_info).map((org) => ({
                    name: org.org_name,
                    role: org.user_role,
                })),
            };
        },
        options,
    };
}