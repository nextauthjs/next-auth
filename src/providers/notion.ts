import { OAuthConfig, OAuthUserConfig } from "."

interface NotionWorkspaceOwner {
  type: "workspace"
  workspace: true
}

interface NotionUserUser {
  object: "user"
  id: string
  name: string
  avatar_url: string
  type: "person"
  person: { email: string }
}

interface NotionBotUser {
  object: "user"
  id: string
  name: string
  avatar_url: string
  type: "bot"
  bot: any
}

interface NotionUserOwner {
  type: "user"
  user: NotionUserUser | NotionBotUser
}

export interface NotionResponseFields {
  workspace_name: string
  workspace_id: string
  workspace_icon: string
  bot_id: string
}

export interface NotionResponse extends NotionResponseFields {
  /**
   * https://developers.notion.com/reference/user#all-users
   * https://developers.notion.com/reference/user#people
   */
  owner: NotionWorkspaceOwner | NotionUserOwner
}

export type NotionProfile = NotionResponseFields &
  (NotionUserOwner | NotionWorkspaceOwner)

export default function Notion<P extends Record<string, any> = NotionProfile>(
  options: OAuthUserConfig<P> & {
    /** @default "2021-08-16" */
    notionVersion?: string
  }
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

        const common = {
          workspace_id: tokens.workspace_id,
          workspace_name: tokens.workspace_name,
          workspace_icon: tokens.workspace_icon,
          bot_id: tokens.bot_id,
          ...tokens.owner,
        }

        if (tokens.owner.type === "user") {
          const commonUser = { ...common, ...tokens.owner.user }
          // User person
          if (tokens.owner.user.type === "person") {
            return { ...commonUser, ...tokens.owner.user.person }
          }
          // User bot
          return { ...commonUser, ...tokens.owner.user.bot }
        }

        // Workspace bot
        return { id: tokens.bot_id, ...common, ...tokens.owner }
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
