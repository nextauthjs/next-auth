import { CallbackParamsType, TokenSet } from "openid-client"
import { openidClient } from "./client"
import { oAuth1Client } from "./client-legacy"
import { useState } from "./state-handler"
import { usePKCECodeVerifier } from "./pkce-handler"
import { OAuthCallbackError } from "../../errors"

import type { Account, LoggerInstance, Profile } from "../../.."
import type { OAuthChecks, OAuthConfig } from "../../../providers"
import type { InternalOptions } from "../../../lib/types"
import type { IncomingRequest, OutgoingResponse } from "../.."
import type { Cookie } from "../cookie"

export default async function oAuthCallback(params: {
  options: InternalOptions<"oauth">
  query: IncomingRequest["query"]
  body: IncomingRequest["body"]
  method: IncomingRequest["method"]
  cookies: IncomingRequest["cookies"]
}): Promise<GetProfileResult & { cookies?: OutgoingResponse["cookies"] }> {
  const { options, query, body, method, cookies } = params
  const { logger, provider } = options

  const errorMessage = body?.error ?? query?.error
  if (errorMessage) {
    const error = new Error(errorMessage)
    logger.error("OAUTH_CALLBACK_HANDLER_ERROR", {
      error,
      error_description: query?.error_description,
      body,
      providerId: provider.id,
    })
    throw error
  }

  if (provider.version?.startsWith("1.")) {
    try {
      const client = await oAuth1Client(options)
      // Handle OAuth v1.x
      const { oauth_token, oauth_verifier } = query ?? {}
      // @ts-expect-error
      const tokens: TokenSet = await client.getOAuthAccessToken(
        oauth_token as string,
        // @ts-expect-error
        null,
        oauth_verifier
      )
      // @ts-expect-error
      let profile: Profile = await client.get(
        (provider as any).profileUrl,
        tokens.oauth_token,
        tokens.oauth_token_secret
      )

      if (typeof profile === "string") {
        profile = JSON.parse(profile)
      }

      return await getProfile({ profile, tokens, provider, logger })
    } catch (error) {
      logger.error("OAUTH_V1_GET_ACCESS_TOKEN_ERROR", error as Error)
      throw error
    }
  }

  try {
    const client = await openidClient(options)

    let tokens: TokenSet

    const checks: OAuthChecks = {}
    const resCookies: Cookie[] = []

    const state = await useState(cookies?.[options.cookies.state.name], options)

    if (state) {
      checks.state = state.value
      resCookies.push(state.cookie)
    }

    const codeVerifier = cookies?.[options.cookies.pkceCodeVerifier.name]
    const pkce = await usePKCECodeVerifier(codeVerifier, options)
    if (pkce) {
      checks.code_verifier = pkce.codeVerifier
      resCookies.push(pkce.cookie)
    }

    const params: CallbackParamsType = {
      ...client.callbackParams({
        url: `http://n?${new URLSearchParams(query)}`,
        // TODO: Ask to allow object to be passed upstream:
        // https://github.com/panva/node-openid-client/blob/3ae206dfc78c02134aa87a07f693052c637cab84/types/index.d.ts#L439
        // @ts-expect-error
        body,
        method,
      }),
      // @ts-expect-error
      ...provider.token?.params,
    }

    // @ts-expect-error
    if (provider.token?.request) {
      // @ts-expect-error
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
    // @ts-expect-error
    if (provider.userinfo?.request) {
      // @ts-expect-error
      profile = await provider.userinfo.request({
        provider,
        tokens,
        client,
      })
    } else if (provider.idToken) {
      profile = tokens.claims()
    } else {
      profile = await client.userinfo(tokens, {
        // @ts-expect-error
        params: provider.userinfo?.params,
      })
    }

    // If a user object is supplied (e.g. Apple provider) add it to the profile object
    // TODO: Remove/extract to Apple provider?
    profile.user = JSON.parse(body?.user ?? query?.user ?? null)

    const profileResult = await getProfile({
      profile,
      provider,
      tokens,
      logger,
    })
    return { ...profileResult, cookies: resCookies }
  } catch (error) {
    logger.error("OAUTH_CALLBACK_ERROR", {
      error: error as Error,
      providerId: provider.id,
    })
    throw new OAuthCallbackError(error as Error)
  }
}

export interface GetProfileParams {
  profile: Profile
  tokens: TokenSet
  provider: OAuthConfig<any>
  logger: LoggerInstance
}

export interface GetProfileResult {
  // @ts-expect-error
  profile: ReturnType<OAuthConfig["profile"]> | null
  account: Omit<Account, "userId"> | null
  OAuthProfile: Profile
}

/** Returns profile, raw profile and auth provider details */
async function getProfile({
  profile: OAuthProfile,
  tokens,
  provider,
  logger,
}: GetProfileParams): Promise<GetProfileResult> {
  try {
    logger.debug("PROFILE_DATA", { OAuthProfile })
    // @ts-expect-error
    const profile = await provider.profile(OAuthProfile, tokens)
    profile.email = profile.email?.toLowerCase()
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
    return {
      profile: null,
      account: null,
      OAuthProfile,
    }
  }
}
