import { openidClient } from "./client"
import { oAuth1Client } from "./client-legacy"
import { getState } from "./state-handler"
import { usePKCECodeVerifier } from "./pkce-handler"
import { OAuthCallbackError } from "../../../lib/errors"
import { TokenSet } from "openid-client"

/** @type {import("types/internals").NextAuthApiHandler} */
export default async function oAuthCallback(req, res) {
  const { logger } = req.options

  /** @type {import("types/providers").OAuthConfig} */
  const provider = req.options.provider

  const errorMessage = req.body.error ?? req.query.error
  if (errorMessage) {
    const error = new Error(errorMessage)
    logger.error("OAUTH_CALLBACK_HANDLER_ERROR", {
      error,
      body: req.body,
      providerId: provider.id,
    })
    throw error
  }

  if (provider.version?.startsWith("1.")) {
    try {
      const client = await oAuth1Client(req.options)
      // Handle OAuth v1.x
      const { oauth_token, oauth_verifier } = req.query
      const tokens = await client.getOAuthAccessToken(
        oauth_token,
        null,
        oauth_verifier
      )
      let profile = await client.get(
        provider.profileUrl,
        tokens.oauth_token,
        tokens.oauth_token_secret
      )

      if (typeof profile === "string") {
        profile = JSON.parse(profile)
      }

      return getProfile({ profile, tokens, provider, logger })
    } catch (error) {
      logger.error("OAUTH_V1_GET_ACCESS_TOKEN_ERROR", error)
      throw error
    }
  }

  try {
    const client = await openidClient(req.options)

    /** @type {import("openid-client").TokenSet} */
    let tokens

    /** @type {import("types/providers").OAuthChecks} */
    const checks = {
      code_verifier: await usePKCECodeVerifier(req, res),
      state: getState(req),
    }
    const params = { ...client.callbackParams(req), ...provider.token?.params }

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

    /** @type {import("types").Profile} */
    let profile
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

    // If a user object is supplied (e.g. Apple provider) add it to the profile object
    // TODO: Remove/extract to Apple provider?
    profile.user = JSON.parse(req.body.user ?? req.query.user ?? null)

    return getProfile({ profile, provider, tokens, logger })
  } catch (error) {
    logger.error("OAUTH_CALLBACK_ERROR", { error, providerId: provider.id })
    throw new OAuthCallbackError(error)
  }
}

/**
 * Returns profile, raw profile and auth provider details
 * @param {import("types/internals/oauth").GetProfileParams} params
 */
async function getProfile({ profile: OAuthProfile, tokens, provider, logger }) {
  try {
    logger.debug("PROFILE_DATA", { OAuthProfile })
    const profile = await provider.profile(OAuthProfile, tokens)
    profile.email = profile.email?.toLowerCase()
    // Return profile, raw profile and auth provider details
    return {
      profile,
      account: {
        provider: provider.id,
        type: provider.type,
        id: profile.id,
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
    logger.error("OAUTH_PARSE_PROFILE_ERROR", { error, OAuthProfile })
    return {
      profile: null,
      account: null,
      OAuthProfile,
    }
  }
}
