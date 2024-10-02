/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>VK</b> integration.</span>
 * <a href="https://vk.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/vk.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/vk
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/** https://dev.vk.com/reference/objects/user */
export interface VkProfile {
  id: number
  first_name: string
  last_name: string
  photo_100: string
  can_access_closed: boolean
  is_closed: boolean
  deactivated?: string
  sex?: 0 | 1 | 2
  screen_name?: string
  photo_50?: string
  online?: 0 | 1
  online_mobile?: 0 | 1
  online_app?: number
  verified?: 0 | 1
  trending?: 0 | 1
  friend_status?: 0 | 1 | 2 | 3
  first_name_nom?: string
  first_name_gen?: string
  first_name_dat?: string
  first_name_acc?: string
  first_name_ins?: string
  first_name_abl?: string
  last_name_nom?: string
  last_name_gen?: string
  last_name_dat?: string
  last_name_acc?: string
  last_name_ins?: string
  last_name_abl?: string
  nickname?: string
  maiden_name?: string
  domain?: string
  bdate?: string
  city?: {
    id: number
    title: string
  }
  country?: {
    id: number
    title: string
  }
  timezone?: number
  photo_200?: string
  photo_max?: string
  photo_200_orig?: string
  photo_400_orig?: string
  photo_max_orig?: string
  photo_id?: string
  has_photo?: 0 | 1
  has_mobile?: 0 | 1
  is_friend?: 0 | 1
  can_post?: 0 | 1
  can_see_all_posts?: 0 | 1
  can_see_audio?: 0 | 1
  connections?: {
    facebook?: string
    skype?: string
    twitter?: string
    livejournal?: string
    instagram?: string
  }
  photo_400?: string
  wall_default?: "owner" | "all"
  interests?: string
  books?: string
  tv?: string
  quotes?: string
  about?: string
  games?: string
  movies?: string
  activities?: string
  music?: string
  can_write_private_message?: 0 | 1
  can_send_friend_request?: 0 | 1
  contacts?: {
    mobile_phone?: string
    home_phone?: string
  }
  site?: string
  status_audio?: {
    access_key?: string
    artist: string
    id: number
    owner_id: number
    title: string
    url?: string
    duration: number
    date?: number
    album_id?: number
    genre_id?: number
    performer?: string
  }
  status?: string
  last_seen?: {
    platform?: 1 | 2 | 3 | 4 | 5 | 6 | 7
    time?: number
  }
  exports?: {
    facebook?: number
    livejournal?: number
    twitter?: number
    instagram?: number
  }
  crop_photo?: {
    photo: {
      access_key?: string
      album_id: number
      date: number
      height?: number
      id: number
      images?: Array<{
        height?: number
        type?: "s" | "m" | "x" | "l" | "o" | "p" | "q" | "r" | "y" | "z" | "w"
        url?: string
        width?: number
      }>
      lat?: number
      long?: number
      owner_id: number
      photo_256?: string
      can_comment?: 0 | 1
      place?: string
      post_id?: number
      sizes?: Array<{
        height: number
        url: string
        src?: string
        type:
          | "s"
          | "m"
          | "x"
          | "o"
          | "p"
          | "q"
          | "r"
          | "k"
          | "l"
          | "y"
          | "z"
          | "c"
          | "w"
          | "a"
          | "b"
          | "e"
          | "i"
          | "d"
          | "j"
          | "temp"
          | "h"
          | "g"
          | "n"
          | "f"
          | "max"
        width: number
      }>
      text?: string
      user_id?: number
      width?: number
      has_tags: boolean
    }
    crop: {
      x: number
      y: number
      x2: number
      y2: number
    }
    rect: {
      x: number
      y: number
      x2: number
      y2: number
    }
  }
  followers_count?: number
  blacklisted?: 0 | 1
  blacklisted_by_me?: 0 | 1
  is_favorite?: 0 | 1
  is_hidden_from_feed?: 0 | 1
  common_count?: number
  occupation?: {
    id?: number
    name?: string
    type?: "work" | "school" | "university"
  }
  career?: {
    group_id?: number
    company?: string
    country_id?: number
    city_id?: number
    city_name?: string
    from?: number
    until?: number
    position?: string
  }
  military?: {
    country_id: number
    from?: number
    unit: string
    unit_id: number
    until?: number
  }
  education?: {
    university?: number
    university_name?: string
    faculty?: number
    faculty_name?: string
    graduation?: number
  }
  home_town?: string
  relation?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  relation_partner?: {
    deactivated?: string
    first_name: string
    hidden?: number
    id: number
    last_name: string
    can_access_closed?: boolean
    is_closed?: boolean
  }
  personal?: {
    alcohol?: 1 | 2 | 3 | 4 | 5
    inspired_by?: string
    langs?: string[]
    life_main?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
    people_main?: 1 | 2 | 3 | 4 | 5 | 6
    political?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
    religion?: string
    smoking?: 1 | 2 | 3 | 4 | 5
  }
  universities?: Array<{
    chair?: number
    chair_name?: string
    city?: number
    country?: number
    education_form?: string
    education_status?: string
    faculty?: number
    faculty_name?: string
    graduation?: number
    id?: number
    name?: string
    university_group_id?: number
  }>
  schools?: Array<{
    city?: number
    class?: string
    country?: number
    id?: string
    name?: string
    type?: number
    type_str?: string
    year_from?: number
    year_graduated?: number
    year_to?: number
    speciality?: string
  }>
  relatives?: Array<{
    id?: number
    name?: string
    type: "parent" | "child" | "grandparent" | "grandchild" | "sibling"
  }>
  counters?: {
    albums?: number
    videos?: number
    audios?: number
    photos?: number
    notes?: number
    friends?: number
    groups?: number
    online_friends?: number
    mutual_friends?: number
    user_videos?: number
    followers?: number
    pages?: number
  }
  is_no_index?: 0 | 1
  // Expand from token https://dev.vk.com/en/reference/access-rights?ref=old_portal
  email?: string
}

/**
 * Add VK login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/vk
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import VK from "@auth/core/providers/vk"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [VK({ clientId: VK_CLIENT_ID, clientSecret: VK_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 * - [VK API documentation](https://vk.com/dev/first_guide)
 * - [VK App configuration](https://vk.com/apps?act=manage)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the VK provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The VK provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/vk.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * :::
 *
 * :::note
 *
 * By default the provider uses 5.126 version of the API. See https://vk.com/dev/versions for more info.
 * If you want to use a different version, you can pass it to provider's options object:
 * ```ts
 * const apiVersion = "5.126"
 * providers: [
 *   Vk({
 *     accessTokenUrl: `https://oauth.vk.com/access_token?v=${apiVersion}`,
 *     requestTokenUrl: `https://oauth.vk.com/access_token?v=${apiVersion}`,
 *     authorizationUrl:
 *       `https://oauth.vk.com/authorize?response_type=code&v=${apiVersion}`,
 *     profileUrl: `https://api.vk.com/method/users.get?fields=photo_100&v=${apiVersion}`,
 *   })
 * ]
 * ```
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
export default function VK<P extends Record<string, any> = VkProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  const apiVersion = "5.131" // https://vk.com/dev/versions

  return {
    id: "vk",
    name: "VK",
    type: "oauth",
    authorization: `https://oauth.vk.com/authorize?scope=email&v=${apiVersion}`,
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    token: `https://oauth.vk.com/access_token?v=${apiVersion}`,
    userinfo: {
      url: `https://api.vk.com/method/users.get?fields=photo_100&v=${apiVersion}`,
      async request({ tokens, provider }) {
        const profile = await fetch(provider.userinfo?.url as URL, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "User-Agent": "authjs",
          },
        }).then(async (res) => await res.json())

        profile.response[0].email = tokens.email ? tokens.email : null

        return profile.response[0]
      },
    },
    profile(profile: P) {
      return {
        id: profile.id,
        name: [profile.first_name, profile.last_name].filter(Boolean).join(" "),
        email: profile.email ?? null,
        image: profile.photo_100,
      }
    },
    style: { bg: "#07F", text: "#fff" },
    options,
  }
}
