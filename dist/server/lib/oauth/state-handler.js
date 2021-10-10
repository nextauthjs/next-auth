"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleCallback = handleCallback;
exports.handleSignin = handleSignin;
exports.default = void 0;

var _crypto = require("crypto");

var _logger = _interopRequireDefault(require("../../../lib/logger"));

var _errors = require("../../../lib/errors");

async function handleCallback(req, res) {
  const {
    csrfToken,
    provider,
    baseUrl,
    basePath
  } = req.options;

  try {
    var _provider$protection;

    if (!((_provider$protection = provider.protection) !== null && _provider$protection !== void 0 && _provider$protection.includes('state'))) {
      return;
    }

    const state = req.query.state || req.body.state;
    const expectedState = (0, _crypto.createHash)('sha256').update(csrfToken).digest('hex');

    _logger.default.debug('OAUTH_CALLBACK_PROTECTION', 'Comparing received and expected state', {
      state,
      expectedState
    });

    if (state !== expectedState) {
      throw new _errors.OAuthCallbackError('Invalid state returned from OAuth provider');
    }
  } catch (error) {
    _logger.default.error('STATE_ERROR', error);

    return res.redirect(`${baseUrl}${basePath}/error?error=OAuthCallback`);
  }
}

async function handleSignin(req, res) {
  const {
    provider,
    baseUrl,
    basePath,
    csrfToken
  } = req.options;

  try {
    var _provider$protection2;

    if (!((_provider$protection2 = provider.protection) !== null && _provider$protection2 !== void 0 && _provider$protection2.includes('state'))) {
      return;
    }

    if ('state' in provider) {
      _logger.default.warn('STATE_OPTION_DEPRECATION', 'The `state` provider option is being replaced with `protection`. See the docs.');
    }

    const state = (0, _crypto.createHash)('sha256').update(csrfToken).digest('hex');
    provider.authorizationParams = { ...provider.authorizationParams,
      state
    };

    _logger.default.debug('OAUTH_CALLBACK_PROTECTION', 'Added state to authorization params', {
      state
    });
  } catch (error) {
    _logger.default.error('SIGNIN_OAUTH_ERROR', error);

    return res.redirect(`${baseUrl}${basePath}/error?error=OAuthSignin`);
  }
}

var _default = {
  handleSignin,
  handleCallback
};
exports.default = _default;