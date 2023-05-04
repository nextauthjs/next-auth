import { TokenSet } from "openid-client"
import { openidClient } from "./client"
import { oAuth1Client, oAuth1TokenStore } from "./client-legacy"
import * as _checks from "./checks"
import { OAuthCallbackError } from "../../errors"

import type { CallbackParamsType } from "openid-client"
import type { LoggerInstance, Profile } from "../../.."
import type { OAuthChecks, OAuthConfig } from "../../../providers"
import type { InternalOptions } from "../../types"
import type { RequestInternal } from "../.."
import type { Cookie } from "../cookie"

export default async function oAuthCallback(params: {
  options: InternalOptions<"oauth">
  query: RequestInternal["query"]
  body: RequestInternal["body"]
  method: Required<RequestInternal>["method"]
  cookies: RequestInternal["cookies"]
}) {
  const { options, query, body, method, cookies } = params
  const { logger, provider } = options

  const errorMessage = body?.error ?? query?.error
  if (errorMessage) {
    const error = new Error(errorMessage)
    logger.error("OAUTH_CALLBACK_HANDLER_ERROR", {
      error,
      error_description: query?.error_description,
      providerId: provider.id,
    })
    logger.debug("OAUTH_CALLBACK_HANDLER_ERROR", { body })
    throw error
  }

  if (provider.version?.startsWith("1.")) {
    try {
      const client = await oAuth1Client(options)
      // Handle OAuth v1.x
      const { oauth_token, oauth_verifier } = query ?? {}
      const tokens = (await (client as any).getOAuthAccessToken(
        oauth_token,
        oAuth1TokenStore.get(oauth_token),
        oauth_verifier
      )) as TokenSet
      let profile: Profile = await (client as any).get(
        provider.profileUrl,
        tokens.oauth_token,
        tokens.oauth_token_secret
      )

      if (typeof profile === "string") {
        profile = JSON.parse(profile)
      }

      const newProfile = await getProfile({ profile, tokens, provider, logger })
      return { ...newProfile, cookies: [] }
    } catch (error) {
      logger.error("OAUTH_V1_GET_ACCESS_TOKEN_ERROR", error as Error)
      throw error
    }
  }

  if (query?.oauth_token) oAuth1TokenStore.delete(query.oauth_token)

  try {
    const client = await openidClient(options)

    let tokens: TokenSet

    const checks: OAuthChecks = {}
    const resCookies: Cookie[] = []

    await _checks.state.use(cookies, resCookies, options, checks)
    await _checks.pkce.use(cookies, resCookies, options, checks)
    await _checks.nonce.use(cookies, resCookies, options, checks)

    const params: CallbackParamsType = {
      ...client.callbackParams({
        url: `http://n?${new URLSearchParams(query)}`,
        // TODO: Ask to allow object to be passed upstream:
        // https://github.com/panva/node-openid-client/blob/3ae206dfc78c02134aa87a07f693052c637cab84/types/index.d.ts#L439
        // @ts-expect-error
        body,
        method,
      }),
      ...provider.token?.params,
    }

    if (provider.token?.request) {
      const response = await provider.token.request({
        provider,
        params,
        checks,
        client,
      })
      tokens = new TokenSet(response.tokens)
    } else if (provider.idToken) {
      tokens = await client.callback(provider.callbackUrl, params, checks)
    } else {
      tokens = await client.oauthCallback(provider.callbackUrl, params, checks)
    }

    // REVIEW: How can scope be returned as an array?
    if (Array.isArray(tokens.scope)) {
      tokens.scope = tokens.scope.join(" ")
    }

    let profile: Profile
    if (provider.userinfo?.request) {
      profile = await provider.userinfo.request({
        provider,
        tokens,
        client,
      })
    } else if (provider.idToken) {
      profile = tokens.claims()
    } else {
      profile = await client.userinfo(tokens, {
        params: provider.userinfo?.params,
      })
    }

    const profileResult = await getProfile({
      profile,
      provider,
      tokens,
      logger,
    })
    return { ...profileResult, cookies: resCookies }
  } catch (error) {
    throw new OAuthCallbackError(error as Error)
  }
}

export interface GetProfileParams {
  profile: Profile
  tokens: TokenSet
  provider: OAuthConfig<any>
  logger: LoggerInstance
}

/** Returns profile, raw profile and auth provider details */
async function getProfile({
  profile: OAuthProfile,
  tokens,
  provider,
  logger,
}: GetProfileParams) {
  try {
    logger.debug("PROFILE_DATA", { OAuthProfile })
    const profile = await provider.profile(OAuthProfile, tokens)
    profile.email = profile.email?.toLowerCase()
    if (!profile.id)
      throw new TypeError(
        `Profile id is missing in ${provider.name} OAuth profile response`
      )

    // Return profile, raw profile and auth provider details
    return {
      profile,
      account: {
        provider: provider.id,
        type: provider.type,
        providerAccountId: profile.id.toString(),
        ...tokens,
      },
      OAuthProfile,
    }
  } catch (error) {
    // If we didn't get a response either there was a problem with the provider
    // response *or* the user cancelled the action with the provider.
    //
    // Unfortuately, we can't tell which - at least not in a way that works for
    // all providers, so we return an empty object; the user should then be
    // redirected back to the sign up page. We log the error to help developers
    // who might be trying to debug this when configuring a new provider.
    logger.error("OAUTH_PARSE_PROFILE_ERROR", {
      error: error as Error,
      OAuthProfile,
    })
  }
}
