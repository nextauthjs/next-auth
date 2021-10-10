"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = oAuthCallback;

var _jsonwebtoken = require("jsonwebtoken");

var _client = _interopRequireDefault(require("./client"));

var _logger = _interopRequireDefault(require("../../../lib/logger"));

var _errors = require("../../../lib/errors");

async function oAuthCallback(req) {
  var _provider$version;

  const {
    provider,
    pkce
  } = req.options;
  const client = (0, _client.default)(provider);

  if ((_provider$version = provider.version) !== null && _provider$version !== void 0 && _provider$version.startsWith("2.")) {
    let {
      code,
      user
    } = req.query;

    if (req.method === "POST") {
      try {
        const body = JSON.parse(JSON.stringify(req.body));

        if (body.error) {
          throw new Error(body.error);
        }

        code = body.code;
        user = body.user != null ? JSON.parse(body.user) : null;
      } catch (error) {
        _logger.default.error("OAUTH_CALLBACK_HANDLER_ERROR", error, req.body, provider.id, code);

        throw error;
      }
    }

    if (Object.prototype.hasOwnProperty.call(provider, "useAuthTokenHeader")) {
      client.useAuthorizationHeaderforGET(provider.useAuthTokenHeader);
    } else {
      client.useAuthorizationHeaderforGET(true);
    }

    try {
      const tokens = await client.getOAuthAccessToken(code, provider, pkce.code_verifier);
      let profileData;

      if (provider.idToken) {
        if (!(tokens !== null && tokens !== void 0 && tokens.id_token)) {
          throw new _errors.OAuthCallbackError("Missing JWT ID Token");
        }

        profileData = (0, _jsonwebtoken.decode)(tokens.id_token, {
          json: true
        });
      } else {
        profileData = await client.get(provider, tokens.accessToken, tokens);
      }

      return getProfile({
        profileData,
        provider,
        tokens,
        user
      });
    } catch (error) {
      _logger.default.error("OAUTH_GET_ACCESS_TOKEN_ERROR", error, provider.id, code);

      throw error;
    }
  }

  try {
    const {
      oauth_token,
      oauth_verifier
    } = req.query;
    const {
      token_secret
    } = await client.getOAuthRequestToken(provider.params);
    const tokens = await client.getOAuthAccessToken(oauth_token, token_secret, oauth_verifier);
    const profileData = await client.get(provider.profileUrl, tokens.oauth_token, tokens.oauth_token_secret);
    return getProfile({
      profileData,
      tokens,
      provider
    });
  } catch (error) {
    _logger.default.error("OAUTH_V1_GET_ACCESS_TOKEN_ERROR", error);

    throw error;
  }
}

async function getProfile({
  profileData,
  tokens,
  provider,
  user
}) {
  try {
    var _profile$email$toLowe, _profile$email;

    if (typeof profileData === "string" || profileData instanceof String) {
      profileData = JSON.parse(profileData);
    }

    if (user != null) {
      profileData.user = user;
    }

    _logger.default.debug("PROFILE_DATA", profileData);

    const profile = await provider.profile(profileData, tokens);
    return {
      profile: { ...profile,
        email: (_profile$email$toLowe = (_profile$email = profile.email) === null || _profile$email === void 0 ? void 0 : _profile$email.toLowerCase()) !== null && _profile$email$toLowe !== void 0 ? _profile$email$toLowe : null
      },
      account: {
        provider: provider.id,
        type: provider.type,
        id: profile.id,
        ...tokens
      },
      OAuthProfile: profileData
    };
  } catch (exception) {
    _logger.default.error("OAUTH_PARSE_PROFILE_ERROR", exception, profileData);

    return {
      profile: null,
      account: null,
      OAuthProfile: profileData
    };
  }
}