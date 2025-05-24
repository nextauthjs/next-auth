/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Last.fm</b> integration.</span>
 * <a href="https://www.last.fm/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/lastfm.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/lastfm
 */
import { createHash } from "crypto";

import type { TokenSet } from "../types.js";
import type { OAuthConfig, OAuthUserConfig } from "./index.js";

export interface LastfmSignatureParams {
  method: string;
  token: string;
  api_key: string;
  api_secret: string;
}

export interface LastfmSession {
  session: {
    name: string;
    key: string;
    subscriber: string;
  };
}

export interface LastfmProfileImage {
  size: "small" | "medium" | "large" | "extralarge";
  "#text": string;
}

export interface LastfmProfile extends Record<string, any> {
  user: {
    name: string;
    age: string;
    subscriber: string;
    realname: string;
    bootstrap: string;
    playcount: string;
    artist_count: string;
    playlists: string;
    track_count: string;
    album_count: string;
    image: LastfmProfileImage[];
    registered: {
      unixtime: string;
      "#text": number;
    };
    country: string;
    gender: string;
    url: string;
    type: string;
  };
}

function generateApiSig({
  method,
  token,
  api_key,
  api_secret,
}: LastfmSignatureParams): string {
  const raw = `api_key${api_key}method${method}token${token}${api_secret}`;

  return createHash("md5").update(raw).digest("hex");
}

/**
 * Add Last.fm login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/lastfm
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Lastfm from "@auth/core/providers/lastfm"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Lastfm({
 *       clientId: LASTFM_API_KEY,
 *       clientSecret: LASTFM_SHARED_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Last.fm OAuth documentation](https://www.last.fm/api/webauth)
 * - [Last.fm app console](https://www.last.fm/api/accounts)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Last.fm provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Last.fm provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/lastfm.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
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
export default function Lastfm<P extends LastfmSession>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "lastfm",
    name: "Last.fm",
    type: "oauth",
    authorization: {
      url: "http://www.last.fm/api/auth",
      params: { api_key: options.clientId },
    },
    token: {
      request: async ({ provider, params }) => {
        const token = params.token;

        const apiSig = generateApiSig({
          method: "auth.getSession",
          token,
          api_key: provider.clientId!,
          api_secret: provider.clientSecret!,
        });

        const res = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=${provider.clientId}&token=${token}&api_sig=${apiSig}&format=json`
        );

        const data = (await res.json()) as LastfmSession;

        return {
          tokens: {
            access_token: data.session.key,
            token_type: "bearer",
            scope: "",
            expires_at: null,
          } satisfies TokenSet,
        };
      },
    },
    userinfo: {
      request: async ({ provider, tokens }) => {
        const res = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getInfo&api_key=${provider.clientId}&sk=${tokens.access_token}&format=json`
        );

        const user = (await res.json()) as LastfmProfile;

        return {
          session: {
            name: user.name,
            key: tokens.access_token,
            subscriber: user.subscriber,
          },
        };
      },
    },
    profile(profile) {
      return {
        id: profile.session.key,
        name: profile.session.name,
        email: null,
        image: null,
      };
    },
    options,
  };
}
