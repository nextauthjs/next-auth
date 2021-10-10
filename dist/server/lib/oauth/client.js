"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = oAuthClient;

var _oauth = require("oauth");

var _querystring = _interopRequireDefault(require("querystring"));

var _logger = _interopRequireDefault(require("../../../lib/logger"));

var _jsonwebtoken = require("jsonwebtoken");

function oAuthClient(provider) {
  var _provider$version;

  if ((_provider$version = provider.version) !== null && _provider$version !== void 0 && _provider$version.startsWith('2.')) {
    const authorizationUrl = new URL(provider.authorizationUrl);
    const basePath = authorizationUrl.origin;
    const authorizePath = authorizationUrl.pathname;
    const accessTokenPath = new URL(provider.accessTokenUrl).pathname;
    const oauth2Client = new _oauth.OAuth2(provider.clientId, provider.clientSecret, basePath, authorizePath, accessTokenPath, provider.headers);
    oauth2Client.getOAuthAccessToken = getOAuth2AccessToken;
    oauth2Client.get = getOAuth2;
    return oauth2Client;
  }

  const oauth1Client = new _oauth.OAuth(provider.requestTokenUrl, provider.accessTokenUrl, provider.clientId, provider.clientSecret, provider.version || '1.0', provider.callbackUrl, provider.encoding || 'HMAC-SHA1');
  const originalGet = oauth1Client.get.bind(oauth1Client);

  oauth1Client.get = (...args) => {
    return new Promise((resolve, reject) => {
      originalGet(...args, (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  };

  const originalGetOAuth1AccessToken = oauth1Client.getOAuthAccessToken.bind(oauth1Client);

  oauth1Client.getOAuthAccessToken = (...args) => {
    return new Promise((resolve, reject) => {
      originalGetOAuth1AccessToken(...args, (error, oauth_token, oauth_token_secret, params) => {
        if (error) {
          return reject(error);
        }

        resolve({
          accessToken: oauth_token,
          refreshToken: oauth_token_secret,
          results: params,
          oauth_token,
          oauth_token_secret,
          params
        });
      });
    });
  };

  const originalGetOAuthRequestToken = oauth1Client.getOAuthRequestToken.bind(oauth1Client);

  oauth1Client.getOAuthRequestToken = (params = {}) => {
    return new Promise((resolve, reject) => {
      originalGetOAuthRequestToken(params, (error, oauth_token, oauth_token_secret, params) => {
        if (error) {
          return reject(error);
        }

        resolve({
          oauth_token,
          oauth_token_secret,
          params
        });
      });
    });
  };

  return oauth1Client;
}

async function getOAuth2AccessToken(code, provider, codeVerifier) {
  const url = provider.accessTokenUrl;
  const params = { ...provider.params
  };
  const headers = { ...provider.headers
  };
  const codeParam = params.grant_type === 'refresh_token' ? 'refresh_token' : 'code';

  if (!params[codeParam]) {
    params[codeParam] = code;
  }

  if (!params.client_id) {
    params.client_id = provider.clientId;
  }

  if (provider.id === 'apple' && typeof provider.clientSecret === 'object') {
    const {
      keyId,
      teamId,
      privateKey
    } = provider.clientSecret;
    const clientSecret = (0, _jsonwebtoken.sign)({
      iss: teamId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 180,
      aud: 'https://appleid.apple.com',
      sub: provider.clientId
    }, privateKey.replace(/\\n/g, '\n'), {
      algorithm: 'ES256',
      keyid: keyId
    });
    params.client_secret = clientSecret;
  } else {
    params.client_secret = provider.clientSecret;
  }

  if (!params.redirect_uri) {
    params.redirect_uri = provider.callbackUrl;
  }

  if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  if (!headers['Client-ID']) {
    headers['Client-ID'] = provider.clientId;
  }

  if (provider.id === 'reddit') {
    headers.Authorization = 'Basic ' + Buffer.from(provider.clientId + ':' + provider.clientSecret).toString('base64');
  }

  if (provider.id === 'identity-server4' && !headers.Authorization) {
    headers.Authorization = `Bearer ${code}`;
  }

  if (provider.protection.includes('pkce')) {
    params.code_verifier = codeVerifier;
  }

  const postData = _querystring.default.stringify(params);

  return new Promise((resolve, reject) => {
    this._request('POST', url, headers, postData, null, (error, data, response) => {
      if (error) {
        _logger.default.error('OAUTH_GET_ACCESS_TOKEN_ERROR', error, data, response);

        return reject(error);
      }

      let raw;

      try {
        raw = JSON.parse(data);
      } catch (_unused) {
        raw = _querystring.default.parse(data);
      }

      let accessToken;

      if (provider.id === 'slack') {
        const {
          ok,
          error
        } = raw;

        if (!ok) {
          return reject(error);
        }

        accessToken = raw.authed_user.access_token;
      } else {
        accessToken = raw.access_token;
      }

      resolve({
        accessToken,
        accessTokenExpires: null,
        refreshToken: raw.refresh_token,
        idToken: raw.id_token,
        ...raw
      });
    });
  });
}

async function getOAuth2(provider, accessToken, results) {
  let url = provider.profileUrl;
  let httpMethod = 'GET';
  const headers = { ...provider.headers
  };

  if (this._useAuthorizationHeaderForGET) {
    headers.Authorization = this.buildAuthHeader(accessToken);

    if (['mailru', 'vk'].includes(provider.id)) {
      const safeAccessTokenURL = new URL(url);
      safeAccessTokenURL.searchParams.append('access_token', accessToken);
      url = safeAccessTokenURL.href;
    }

    if (provider.id === 'twitch') {
      headers['Client-ID'] = provider.clientId;
    }

    accessToken = null;
  }

  if (provider.id === 'bungie') {
    url = prepareProfileUrl({
      provider,
      url,
      results
    });
  }

  if (provider.id === 'dropbox') {
    httpMethod = 'POST';
  }

  return new Promise((resolve, reject) => {
    this._request(httpMethod, url, headers, null, accessToken, (error, profileData) => {
      if (error) {
        return reject(error);
      }

      resolve(profileData);
    });
  });
}

function prepareProfileUrl({
  provider,
  url,
  results
}) {
  var _provider$headers;

  if (!results.membership_id) {
    throw new Error('Expected membership_id to be passed.');
  }

  if (!((_provider$headers = provider.headers) !== null && _provider$headers !== void 0 && _provider$headers['X-API-Key'])) {
    throw new Error('The Bungie provider requires the X-API-Key option to be present in "headers".');
  }

  return url.replace('{membershipId}', results.membership_id);
}