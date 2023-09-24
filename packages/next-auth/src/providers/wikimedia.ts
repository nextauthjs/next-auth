import type { OAuthConfig, OAuthUserConfig } from "."

export type WikimediaGroup =
  | "*"
  | "user"
  | "autoconfirmed"
  | "extendedconfirmed"
  | "bot"
  | "sysop"
  | "bureaucrat"
  | "steward"
  | "accountcreator"
  | "import"
  | "transwiki"
  | "ipblock-exempt"
  | "oversight"
  | "rollbacker"
  | "propertycreator"
  | "wikidata-staff"
  | "flood"
  | "translationadmin"
  | "confirmed"
  | "flow-bot"
  | "checkuser"

export type WikimediaGrant =
  | "basic"
  | "blockusers"
  | "checkuser"
  | "createaccount"
  | "delete"
  | "editinterface"
  | "editmycssjs"
  | "editmyoptions"
  | "editmywatchlist"
  | "editpage"
  | "editprotected"
  | "editsiteconfig"
  | "globalblock"
  | "highvolume"
  | "import"
  | "mergehistory"
  | "oath"
  | "oversight"
  | "patrol"
  | "privateinfo"
  | "protect"
  | "rollback"
  | "sendemail"
  | "shortenurls"
  | "uploadfile"
  | "viewdeleted"
  | "viewmywatchlist"

export type WikimediaRight =
  | "abusefilter-log"
  | "apihighlimits"
  | "applychangetags"
  | "autoconfirmed"
  | "autopatrol"
  | "autoreview"
  | "bigdelete"
  | "block"
  | "blockemail"
  | "bot"
  | "browsearchive"
  | "changetags"
  | "checkuser"
  | "checkuser-log"
  | "createaccount"
  | "createpage"
  | "createpagemainns"
  | "createtalk"
  | "delete"
  | "delete-redirect"
  | "deletedhistory"
  | "deletedtext"
  | "deletelogentry"
  | "deleterevision"
  | "edit"
  | "edit-legal"
  | "editinterface"
  | "editmyoptions"
  | "editmyusercss"
  | "editmyuserjs"
  | "editmyuserjson"
  | "editmywatchlist"
  | "editprotected"
  | "editsemiprotected"
  | "editsitecss"
  | "editsitejs"
  | "editsitejson"
  | "editusercss"
  | "edituserjs"
  | "edituserjson"
  | "globalblock"
  | "import"
  | "importupload"
  | "ipblock-exempt"
  | "item-merge"
  | "item-redirect"
  | "item-term"
  | "markbotedits"
  | "massmessage"
  | "mergehistory"
  | "minoredit"
  | "move"
  | "move-subpages"
  | "movefile"
  | "movestable"
  | "mwoauth-authonlyprivate"
  | "nominornewtalk"
  | "noratelimit"
  | "nuke"
  | "patrol"
  | "patrolmarks"
  | "property-create"
  | "property-term"
  | "protect"
  | "purge"
  | "read"
  | "reupload"
  | "reupload-own"
  | "reupload-shared"
  | "rollback"
  | "sendemail"
  | "skipcaptcha"
  | "suppressionlog"
  | "tboverride"
  | "templateeditor"
  | "torunblocked"
  | "transcode-reset"
  | "translate"
  | "undelete"
  | "unwatchedpages"
  | "upload"
  | "upload_by_url"
  | "viewmywatchlist"
  | "viewsuppressed"
  | "writeapi"

export interface WikimediaProfile extends Record<string, any> {
  sub: string
  username: string
  editcount: number
  confirmed_email: boolean
  blocked: boolean
  registered: string
  groups: WikimediaGroup[]
  rights: WikimediaRight[]
  grants: WikimediaGrant[]
  realname: string
  email: string
}

/**
 * Wikimedia OAuth2 provider.
 * All Wikimedia wikis are supported. Wikipedia, Wikidata, etc...
 *
 * (Register)[https://meta.wikimedia.org/wiki/Special:OAuthConsumerRegistration]
 * (Documentation)[https://www.mediawiki.org/wiki/Extension:OAuth]
 */
export default function Wikimedia<P extends WikimediaProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "wikimedia",
    name: "Wikimedia",
    type: "oauth",
    token: "https://meta.wikimedia.org/w/rest.php/oauth2/access_token",
    userinfo: "https://meta.wikimedia.org/w/rest.php/oauth2/resource/profile",
    authorization: {
      url: "https://meta.wikimedia.org/w/rest.php/oauth2/authorize",
      params: { scope: "" },
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.username,
        email: profile.email,
      }
    },
    style: {
      logo: "/wikimedia.svg",
      logoDark: "/wikimedia-dark.svg",
      bg: "#fff",
      text: "#000",
      bgDark: "#000",
      textDark: "#fff",
    },
    options,
  }
}
