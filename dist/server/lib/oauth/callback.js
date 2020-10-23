"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = require("crypto");

var _querystring = _interopRequireDefault(require("querystring"));

var _jwtDecode = _interopRequireDefault(require("jwt-decode"));

var _client = _interopRequireDefault(require("./client"));

var _logger = _interopRequireDefault(require("../../../lib/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = function () {
  var _ref = _asyncToGenerator(function* (req, provider, csrfToken, callback) {
    var {
      oauth_token,
      oauth_verifier,
      code,
      user,
      state
    } = req.query;
    var client = (0, _client.default)(provider);

    if (provider.version && provider.version.startsWith('2.')) {
      if (!Object.prototype.hasOwnProperty.call(provider, 'state') || provider.state === true) {
        var expectedState = (0, _crypto.createHash)('sha256').update(csrfToken).digest('hex');

        if (state !== expectedState) {
          return callback(new Error('Invalid state returned from oAuth provider'));
        }
      }

      if (req.method === 'POST') {
        try {
          var body = JSON.parse(JSON.stringify(req.body));

          if (body.error) {
            throw new Error(body.error);
          }

          code = body.code;
          user = body.user != null ? JSON.parse(body.user) : null;
        } catch (e) {
          _logger.default.error('OAUTH_CALLBACK_HANDLER_ERROR', e, req.body, provider.id, code);

          return callback();
        }
      }

      if (Object.prototype.hasOwnProperty.call(provider, 'useAuthTokenHeader')) {
        client.useAuthorizationHeaderforGET(provider.useAuthTokenHeader);
      } else {
        client.useAuthorizationHeaderforGET(true);
      }

      client.getOAuthAccessToken = _getOAuthAccessToken;
      yield client.getOAuthAccessToken(code, provider, (error, accessToken, refreshToken, results) => {
        if (error || results.error) {
          _logger.default.error('OAUTH_GET_ACCESS_TOKEN_ERROR', error, results, provider.id, code);

          return callback(error || results.error);
        }

        if (provider.idToken) {
          if (!results || !results.id_token) {
            return callback();
          }

          _decodeToken(provider, accessToken, refreshToken, results.id_token, function () {
            var _ref2 = _asyncToGenerator(function* (error, profileData) {
              var {
                profile,
                account,
                OAuthProfile
              } = yield _getProfile(error, profileData, accessToken, refreshToken, provider, user);
              callback(error, profile, account, OAuthProfile);
            });

            return function (_x5, _x6) {
              return _ref2.apply(this, arguments);
            };
          }());
        } else {
          client.get = _get;
          client.get(provider, accessToken, function () {
            var _ref3 = _asyncToGenerator(function* (error, profileData) {
              var {
                profile,
                account,
                OAuthProfile
              } = yield _getProfile(error, profileData, accessToken, refreshToken, provider);
              callback(error, profile, account, OAuthProfile);
            });

            return function (_x7, _x8) {
              return _ref3.apply(this, arguments);
            };
          }());
        }
      });
    } else {
      yield client.getOAuthAccessToken(oauth_token, null, oauth_verifier, (error, accessToken, refreshToken, results) => {
        if (error || results.error) {
          _logger.default.error('OAUTH_V1_GET_ACCESS_TOKEN_ERROR', error, results);
        }

        client.get(provider.profileUrl, accessToken, refreshToken, function () {
          var _ref4 = _asyncToGenerator(function* (error, profileData) {
            var {
              profile,
              account,
              OAuthProfile
            } = yield _getProfile(error, profileData, accessToken, refreshToken, provider);
            callback(error, profile, account, OAuthProfile);
          });

          return function (_x9, _x10) {
            return _ref4.apply(this, arguments);
          };
        }());
      });
    }
  });

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = _default;

function _getProfile(_x11, _x12, _x13, _x14, _x15, _x16) {
  return _getProfile2.apply(this, arguments);
}

function _getProfile2() {
  _getProfile2 = _asyncToGenerator(function* (error, profileData, accessToken, refreshToken, provider, userData) {
    if (error) {
      _logger.default.error('OAUTH_GET_PROFILE_ERROR', error);
    }

    var profile = {};

    try {
      if (typeof profileData === 'string' || profileData instanceof String) {
        profileData = JSON.parse(profileData);
      }

      if (userData != null) {
        profileData.user = userData;
      }

      _logger.default.debug('PROFILE_DATA', profileData);

      profile = yield provider.profile(profileData);
    } catch (exception) {
      _logger.default.error('OAUTH_PARSE_PROFILE_ERROR', exception, profileData);

      return {
        profile: null,
        account: null,
        OAuthProfile: profileData
      };
    }

    return {
      profile: {
        name: profile.name,
        email: profile.email ? profile.email.toLowerCase() : null,
        image: profile.image
      },
      account: {
        provider: provider.id,
        type: provider.type,
        id: profile.id,
        refreshToken,
        accessToken,
        accessTokenExpires: null
      },
      OAuthProfile: profileData
    };
  });
  return _getProfile2.apply(this, arguments);
}

function _getOAuthAccessToken(_x17, _x18, _x19) {
  return _getOAuthAccessToken2.apply(this, arguments);
}

function _getOAuthAccessToken2() {
  _getOAuthAccessToken2 = _asyncToGenerator(function* (code, provider, callback) {
    var url = provider.accessTokenUrl;
    var setGetAccessTokenAuthHeader = provider.setGetAccessTokenAuthHeader !== null ? provider.setGetAccessTokenAuthHeader : true;
    var params = _objectSpread({}, provider.params) || {};
    var headers = _objectSpread({}, provider.headers) || {};
    var codeParam = params.grant_type === 'refresh_token' ? 'refresh_token' : 'code';

    if (!params[codeParam]) {
      params[codeParam] = code;
    }

    if (!params.client_id) {
      params.client_id = provider.clientId;
    }

    if (!params.client_secret) {
      if (provider.clientSecretCallback) {
        params.client_secret = yield provider.clientSecretCallback(provider.clientSecret);
      } else {
        params.client_secret = provider.clientSecret;
      }
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

    if (setGetAccessTokenAuthHeader) {
      if (!headers.Authorization) {
        headers.Authorization = "Bearer ".concat(code);
      }
    }

    var postData = _querystring.default.stringify(params);

    this._request('POST', url, headers, postData, null, (error, data, response) => {
      if (error) {
        _logger.default.error('OAUTH_GET_ACCESS_TOKEN_ERROR', error, data, response);

        return callback(error);
      }

      var results;

      try {
        results = JSON.parse(data);
      } catch (e) {
        results = _querystring.default.parse(data);
      }

      var accessToken = results.access_token;
      var refreshToken = results.refresh_token;
      callback(null, accessToken, refreshToken, results);
    });
  });
  return _getOAuthAccessToken2.apply(this, arguments);
}

function _get(provider, accessToken, callback) {
  var url = provider.profileUrl;
  var headers = provider.headers || {};

  if (this._useAuthorizationHeaderForGET) {
    headers.Authorization = this.buildAuthHeader(accessToken);
    headers['Client-ID'] = provider.clientId;
    accessToken = null;
  }

  this._request('GET', url, headers, null, accessToken, callback);
}

function _decodeToken(provider, accessToken, refreshToken, idToken, callback) {
  if (!idToken) {
    throw new Error('Missing JWT ID Token', provider, idToken);
  }

  var decodedToken = (0, _jwtDecode.default)(idToken);
  var profileData = JSON.stringify(decodedToken);
  callback(null, profileData, accessToken, refreshToken, provider);
}