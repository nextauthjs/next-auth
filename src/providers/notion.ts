import { OAuthConfig, OAuthUserConfig } from "."

export interface NotionResponse {
  /**
   * https://developers.notion.com/reference/user#all-users
   * https://developers.notion.com/reference/user#people
   */
  owner: {
    id: string
    name: string
    avatar_url: string
    email?: string
    person: any
  }
  workspace_name: string
  workspace_id: string
  workspace_icon: string
}

export type NotionProfile = NotionResponse["owner"] &
  Omit<NotionResponse, "owner">

export default function Notion<P extends Record<string, any> = NotionProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "notion",
    name: "Notion",
    type: "oauth",
    authorization: "https://api.notion.com/v1/oauth/authorize?owner=user",
    token: "https://api.notion.com/v1/oauth/token",
    userinfo: {
      request(params) {
        // https://developers.notion.com/docs/authorization#exchanging-the-grant-for-an-access-token
        const tokens = params.tokens as unknown as NotionResponse
        return {
          id: tokens.owner.id,
          name: tokens.owner.name,
          email: tokens.owner.email,
          avatar_url: tokens.owner.avatar_url,
          workspace_id: tokens.workspace_id,
          workspace_name: tokens.workspace_name,
          workspace_icon: tokens.workspace_icon,
        }
      },
    },
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.avatar_url,
      }
    },
    checks: ["state"],
    options,
  }
}
