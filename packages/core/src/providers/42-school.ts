/**
 * <div style={{backgroundColor: "#fff", display: "flex", justifyContent: "space-between", color: "#000", padding: 16}}>
 * <span>Built-in <b>42School</b> integration.</span>
 * <a href="https://api.intra.42.fr//">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/42-school.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/42-school
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface UserData {
  id: number
  email: string
  login: string
  first_name: string
  last_name: string
  usual_full_name: null | string
  usual_first_name: null | string
  url: string
  phone: "hidden" | string | null
  displayname: string
  image_url: string | null
  "staff?": boolean
  correction_point: number
  pool_month: string | null
  pool_year: string | null
  location: string | null
  wallet: number
  anonymize_date: string
  created_at: string
  updated_at: string | null
  alumni: boolean
  "is_launched?": boolean
}

export interface CursusUser {
  grade: string | null
  level: number
  skills: Array<{ id: number; name: string; level: number }>
  blackholed_at: string | null
  id: number
  begin_at: string | null
  end_at: string | null
  cursus_id: number
  has_coalition: boolean
  created_at: string
  updated_at: string | null
  user: UserData
  cursus: { id: number; created_at: string; name: string; slug: string }
}

export interface ProjectUser {
  id: number
  occurrence: number
  final_mark: number | null
  status: "in_progress" | "finished"
  "validated?": boolean | null
  current_team_id: number
  project: {
    id: number
    name: string
    slug: string
    parent_id: number | null
  }
  cursus_ids: number[]
  marked_at: string | null
  marked: boolean
  retriable_at: string | null
  created_at: string
  updated_at: string | null
}

export interface Achievement {
  id: number
  name: string
  description: string
  tier: "none" | "easy" | "medium" | "hard" | "challenge"
  kind: "scolarity" | "project" | "pedagogy" | "scolarity"
  visible: boolean
  image: string | null
  nbr_of_success: number | null
  users_url: string
}

export interface LanguagesUser {
  id: number
  language_id: number
  user_id: number
  position: number
  created_at: string
}

export interface TitlesUser {
  id: number
  user_id: number
  title_id: number
  selected: boolean
  created_at: string
  updated_at: string | null
}

export interface ExpertisesUser {
  id: number
  expertise_id: number
  interested: boolean
  value: number
  contact_me: boolean
  created_at: string
  user_id: number
}

export interface Campus {
  id: number
  name: string
  time_zone: string
  language: {
    id: number
    name: string
    identifier: string
    created_at: string
    updated_at: string | null
  }
  users_count: number
  vogsphere_id: number
  country: string
  address: string
  zip: string
  city: string
  website: string
  facebook: string
  twitter: string
  active: boolean
  email_extension: string
  default_hidden_phone: boolean
}

export interface CampusUser {
  id: number
  user_id: number
  campus_id: number
  is_primary: boolean
  created_at: string
  updated_at: string | null
}

export interface Image {
  link: string,
  versions: {
    micro: string,
    small: string,
    medium: string,
    large: string,
  }
}

export interface FortyTwoProfile extends UserData, Record<string, any> {
  groups: Array<{ id: string; name: string }>
  cursus_users: CursusUser[]
  projects_users: ProjectUser[]
  languages_users: LanguagesUser[]
  achievements: Achievement[]
  titles: Array<{ id: string; name: string }>
  titles_users: TitlesUser[]
  partnerships: any[]
  patroned: any[]
  patroning: any[]
  expertises_users: ExpertisesUser[]
  roles: Array<{ id: string; name: string }>
  campus: Campus[]
  campus_users: CampusUser[]
  image: Image
  user: any | null
}

/**
 * Add 42School login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/42-school
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import 42School from "@auth/core/providers/42-school"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [42School({ clientId: 42_SCHOOL_CLIENT_ID, clientSecret: 42_SCHOOL_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [42School OAuth documentation](https://api.intra.42.fr/apidoc/guides/web_application_flow)
 *
 * ### Notes
 *
 *
 * :::note
 * 42 returns a field on `Account` called `created_at` which is a number. See the [docs](https://api.intra.42.fr/apidoc/guides/getting_started#make-basic-requests). Make sure to add this field to your database schema, in case if you are using an [Adapter](https://authjs.dev/reference/core/adapters).
 * :::
 * By default, Auth.js assumes that the 42School provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The 42School provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/42-school.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/providers/custom-provider#override-default-options).
 *
 * :::
 *
 * :::info **Disclaimer**
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 *
 * :::
 */
export default function FortyTwo<P extends FortyTwoProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "42-school",
    name: "42 School",
    type: "oauth",
    authorization: {
      url: "https://api.intra.42.fr/oauth/authorize",
      params: { scope: "public" },
    },
    token: "https://api.intra.42.fr/oauth/token",
    userinfo: "https://api.intra.42.fr/v2/me",
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.usual_full_name,
        email: profile.email,
        image: profile.image.link,
      }
    },
    options,
  }
}
