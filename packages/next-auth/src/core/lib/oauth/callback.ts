import { openidClient } from "./client"
import { oAuth1Client } from "./client-legacy"
import { useState } from "./state-handler"
import { usePKCECodeVerifier } from "./pkce-handler"
import { OAuthCallbackError } from "../../errors"
import {
  authorizationCodeGrantRequest,
  getValidatedIdTokenClaims,
  isOAuth2Error,
  OAuth2Error,
  OAuth2TokenEndpointResponse,
  OpenIDTokenEndpointResponse,
  processAuthorizationCodeOAuth2Response,
  processAuthorizationCodeOpenIDResponse,
  processUserInfoResponse,
  userInfoRequest,
  validateAuthResponse,
} from "@panva/oauth4webapi"
import getAuthorizationServer from "./authorization-server"

import type { Account, LoggerInstance, Profile } from "../../.."
import type { OAuthConfig } from "../../../providers"
import type { InternalOptions } from "../../../lib/types"
import type { IncomingRequest, OutgoingResponse } from "../.."
import type { Cookie } from "../cookie"
import { URLSearchParams } from "url"

export default async function oAuthCallback(params: {
  options: InternalOptions<"oauth">
  query: IncomingRequest["query"]
  body: IncomingRequest["body"]
  method: Required<IncomingRequest>["method"]
  cookies: IncomingRequest["cookies"]
}): Promise<GetProfileResult & { cookies?: OutgoingResponse["cookies"] }> {
  const { options, query, body, cookies } = params
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
    const client = openidClient(provider)
    const authorizationServer = await getAuthorizationServer(provider)

    let tokens:
      | OpenIDTokenEndpointResponse
      | OAuth2TokenEndpointResponse
      | OAuth2Error

    const resCookies: Cookie[] = []

    const state = await useState(cookies?.[options.cookies.state.name], options)

    if (state) {
      resCookies.push(state.cookie)
    }

    const codeVerifier = cookies?.[options.cookies.pkceCodeVerifier.name]
    const pkce = await usePKCECodeVerifier(codeVerifier, options)
    if (pkce) {
      resCookies.push(pkce.cookie)
    }

    const callbackParameters = validateAuthResponse(
      authorizationServer,
      client,
      new URLSearchParams(query),
      state?.value
    )
    if (isOAuth2Error(callbackParameters)) {
      throw new Error()
    }

    const response = await authorizationCodeGrantRequest(
      authorizationServer,
      client,
      callbackParameters,
      provider.callbackUrl,
      pkce?.codeVerifier as string
    )
    if (typeof provider.token !== "string" && provider.token?.request) {
      const params = {
        ...callbackParameters,
        ...provider.token?.params,
      }
      const checks = new URLSearchParams()
      if (state) checks.append("state", state.value)
      if (pkce) checks.append("code_verifier", pkce.codeVerifier)
      const response = await provider.token.request({
        provider,
        params,
        checks,
        client,
      })
      tokens = response.tokens
    } else if (provider.idToken) {
      tokens = await processAuthorizationCodeOpenIDResponse(
        authorizationServer,
        client,
        response
      )
    } else {
      tokens = await processAuthorizationCodeOAuth2Response(
        authorizationServer,
        client,
        response
      )
    }

    if (isOAuth2Error(tokens)) {
      throw new Error()
    }

    let profile: Profile | Response
    if (typeof provider.userinfo !== "string" && provider.userinfo?.request) {
      profile = await provider.userinfo.request({
        provider,
        tokens,
        client,
      })
    } else if (provider.idToken) {
      const idToken = getValidatedIdTokenClaims(tokens)

      profile = await processUserInfoResponse(
        authorizationServer,
        client,
        idToken?.sub as string,
        response
      )
    } else {
      profile = await userInfoRequest(
        authorizationServer,
        client,
        tokens.access_token
      )
    }

    const profileResult = await getProfile({
      profile: profile as Profile,
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
  tokens: OpenIDTokenEndpointResponse | OAuth2TokenEndpointResponse
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
