"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _client = _interopRequireDefault(require("../oauth/client"));

var _crypto = require("crypto");

var _logger = _interopRequireDefault(require("../../../lib/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (provider, csrfToken, callback) => {
  var {
    callbackUrl
  } = provider;
  var client = (0, _client.default)(provider);

  if (provider.version && provider.version.startsWith('2.')) {
    var url = client.getAuthorizeUrl({
      redirect_uri: provider.callbackUrl,
      scope: provider.scope,
      state: (0, _crypto.createHash)('sha256').update(csrfToken).digest('hex')
    });

    if (provider.authorizationUrl.includes('?')) {
      var parseUrl = new URL(provider.authorizationUrl);
      var baseUrl = "".concat(parseUrl.origin).concat(parseUrl.pathname, "?");
      url = url.replace(baseUrl, provider.authorizationUrl + '&');
    }

    callback(null, url);
  } else {
    client.getOAuthRequestToken((error, oAuthToken) => {
      if (error) {
        _logger.default.error('GET_AUTHORISATION_URL_ERROR', error);
      }

      var url = "".concat(provider.authorizationUrl, "?oauth_token=").concat(oAuthToken);
      callback(error, url);
    }, callbackUrl);
  }
};

exports.default = _default;