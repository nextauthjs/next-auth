import { oAuth1Client, openidClient } from "./client"
import { getState } from "./state-handler"

/** @param {import("types/internals").NextAuthRequest} req */
export default async function oAuthCallback(req) {
  const { provider, logger } = req.options

  try {
    const error = req.body.error ?? req.query.error
    if (error) {
      throw new Error(error)
    }
  } catch (error) {
    logger.error("OAUTH_CALLBACK_HANDLER_ERROR", error, req.body, provider.id)
    throw error
  }

  if (provider.version?.startsWith("1.")) {
    try {
      const client = await oAuth1Client(req.options)
      // Handle OAuth v1.x
      const {
        oauth_token: oauthToken,
        oauth_verifier: oauthVerifier,
      } = req.query
      const tokens = await client.getOAuthAccessToken(
        oauthToken,
        null,
        oauthVerifier
      )
      const profileData = await client.get(
        provider.profileUrl,
        tokens.accessToken,
        tokens.refreshToken
      )

      return getProfile({ profile: profileData, tokens, provider })
    } catch (error) {
      logger.error("OAUTH_V1_GET_ACCESS_TOKEN_ERROR", error)
      throw error
    }
  }

  try {
    const client = await openidClient(req.options)
    const params = client.callbackParams(req)

    /** @type {import("openid-client").OpenIDCallbackChecks | import("openid-client").OAuthCallbackChecks} */
    const checks = {
      code_verifier: req.options.pkce.code_verifier,
      state: getState(req),
    }
    let profile
    let tokens

    if (provider.idToken) {
      // TODO: Add nonce check
      tokens = await client.callback(provider.callbackUrl, params, checks)
      profile = tokens.claims()
    } else {
      tokens = await client.oauthCallback(provider.callbackUrl, params, checks)
      profile = await client.userinfo(tokens)
    }

    // If a user object is supplied (e.g. Apple provider) add it to the profile object
    profile.user = req.body.user ?? JSON.parse(req.query.user) ?? undefined

    return getProfile({ profile, provider, tokens, logger })
  } catch (error) {
    logger.error("OAUTH_GET_ACCESS_TOKEN_ERROR", error, provider.id)
    throw error
  }
}

/**
 * Returns profile, raw profile and auth provider details
 * @param {{
     profile: import("types").Profile
     tokens: import("openid-client").TokenSet
     provider: import("types/providers").AppProvider
 * }} profileParams
 */
async function getProfile({ profile: OAuthProfile, tokens, provider, logger }) {
  try {
    logger.debug("PROFILE_DATA", OAuthProfile)
    const profile = await provider.profile(OAuthProfile, tokens)
    profile.email = profile.email?.toLowerCase() ?? null
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
  } catch (exception) {
    // If we didn't get a response either there was a problem with the provider
    // response *or* the user cancelled the action with the provider.
    //
    // Unfortuately, we can't tell which - at least not in a way that works for
    // all providers, so we return an empty object; the user should then be
    // redirected back to the sign up page. We log the error to help developers
    // who might be trying to debug this when configuring a new provider.
    logger.error("OAUTH_PARSE_PROFILE_ERROR", exception, OAuthProfile)
    return {
      profile: null,
      account: null,
      OAuthProfile,
    }
  }
}
