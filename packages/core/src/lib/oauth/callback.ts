import { OAuthCallbackError } from "../../errors"
import { useNonce } from "./nonce-handler"
import { usePKCECodeVerifier } from "./pkce-handler"
import { useState } from "./state-handler"
import * as o from "oauth4webapi"

import type {
  InternalOptions,
  LoggerInstance,
  Profile,
  RequestInternal,
  TokenSet,
} from "../.."
import type { OAuthConfigInternal } from "../../providers"
import type { Cookie } from "../cookie"

export async function handleOAuthCallback(params: {
  options: InternalOptions<"oauth">
  query: RequestInternal["query"]
  body: RequestInternal["body"]
  cookies: RequestInternal["cookies"]
}) {
  const { options, query, body, cookies } = params
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

  try {
    let as: o.AuthorizationServer

    if (!provider.token?.url && !provider.userinfo?.url) {
      // We assume that issuer is always defined as this has been asserted earlier
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const issuer = new URL(provider.issuer!)
      const discoveryResponse = await o.discoveryRequest(issuer)
      const discoveredAs = await o.processDiscoveryResponse(
        issuer,
        discoveryResponse
      )

      if (!discoveredAs.token_endpoint)
        throw new TypeError(
          "TODO: Authorization server did not provide a token endpoint."
        )

      if (!discoveredAs.userinfo_endpoint)
        throw new TypeError(
          "TODO: Authorization server did not provide a userinfo endpoint."
        )

      as = discoveredAs
    } else {
      as = {
        issuer: provider.issuer ?? "https://a", // TODO: review fallback issuer
        token_endpoint: provider.token?.url.toString(),
        userinfo_endpoint: provider.userinfo?.url.toString(),
      }
    }

    const client: o.Client = {
      client_id: provider.clientId,
      client_secret: provider.clientSecret,
      token_endpoint_auth_method:
        "client_secret_basic" ?? provider.client?.token_endpoint_auth_method,
      // TODO: support other client options
    }

    const resCookies: Cookie[] = []

    const state = await useState(cookies?.[options.cookies.state.name], options)
    if (state) resCookies.push(state.cookie)

    const codeVerifier = await usePKCECodeVerifier(
      cookies?.[options.cookies.pkceCodeVerifier.name],
      options
    )
    if (codeVerifier) resCookies.push(codeVerifier.cookie)

    // TODO:
    const nonce = await useNonce(cookies?.[options.cookies.nonce.name], options)
    if (nonce && provider.idToken) {
      resCookies.push(nonce.cookie)
    }

    const parameters = o.validateAuthResponse(
      as,
      client,
      new URLSearchParams(query),
      provider.checks.includes("state") ? state?.value : o.skipStateCheck
    )

    if (o.isOAuth2Error(parameters)) {
      console.log("error", parameters)
      throw new Error("TODO: Handle OAuth 2.0 redirect error")
    }

    const response = await o.authorizationCodeGrantRequest(
      as,
      client,
      parameters,
      provider.callbackUrl,
      codeVerifier?.codeVerifier ?? "yooo" // TODO: review fallback code verifier
    )

    let challenges: o.WWWAuthenticateChallenge[] | undefined
    if ((challenges = o.parseWwwAuthenticateChallenges(response))) {
      for (const challenge of challenges) {
        console.log("challenge", challenge)
      }
      throw new Error("TODO: Handle www-authenticate challenges as needed")
    }

    const tokens = await o.processAuthorizationCodeOAuth2Response(
      as,
      client,
      response
    )
    if (o.isOAuth2Error(tokens)) {
      console.log("error", tokens)
      throw new Error("TODO: Handle OAuth 2.0 response body error")
    }

    let profile: Profile = {}

    if (provider.userinfo?.url) {
      const userinfoResponse = await o.userInfoRequest(
        as,
        client,
        tokens.access_token
      )
      profile = await userinfoResponse.json()
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

interface GetProfileParams {
  profile: Profile
  tokens: TokenSet
  provider: OAuthConfigInternal<any>
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
