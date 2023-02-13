import { decodeJwt } from "jose"
import type { OIDCConfig, OIDCUserConfig } from "./index.js"

export interface VippsProfile extends Record<string, any> {
  sid: string
  birthdate: string
  email: string
  email_verified: boolean
  family_name: string
  given_name: string
  name: string
  phone_number: string
  sub: string
}

export default function Vipps<P extends VippsProfile>(
  options: OIDCUserConfig<P>
): OIDCConfig<P> {
  return {
    id: "vipps",
    name: "Vipps",
    type: "oidc",
    issuer: "https://apitest.vipps.no/access-management-1.0/access/",
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    authorization: {
      params: {
        scope: "openid name email",
        state: "state-nextjs-vipps",
        redirect_uri: "http://localhost:3000/api/auth/callback/vipps",
        client_id: options.clientId,
        response_type: "code",
      },
    },
    userinfo: {
      async request({ tokens }) {
        const response = await fetch(
          "https://apitest.vipps.no/vipps-userinfo-api/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          }
        )

        return await response.json()
      },
    },
    profile(profile, tokens) {
      console.log("TOKEN", tokens.access_token)
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
      }
    },
    options,
  }
}
