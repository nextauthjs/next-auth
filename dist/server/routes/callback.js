"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _callback = _interopRequireDefault(require("../lib/oauth/callback"));

var _callbackHandler = _interopRequireDefault(require("../lib/callback-handler"));

var _cookie = _interopRequireDefault(require("../lib/cookie"));

var _logger = _interopRequireDefault(require("../../lib/logger"));

var _dispatchEvent = _interopRequireDefault(require("../lib/dispatch-event"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = function () {
  var _ref = _asyncToGenerator(function* (req, res, options, done) {
    var {
      provider: providerName,
      providers,
      adapter,
      baseUrl,
      basePath,
      secret,
      cookies,
      callbackUrl,
      pages,
      jwt,
      events,
      callbacks,
      csrfToken,
      redirect
    } = options;
    var provider = providers[providerName];
    var {
      type
    } = provider;
    var useJwtSession = options.session.jwt;
    var sessionMaxAge = options.session.maxAge;
    var sessionToken = req.cookies ? req.cookies[cookies.sessionToken.name] : null;

    if (type === 'oauth') {
      try {
        (0, _callback.default)(req, provider, csrfToken, function () {
          var _ref2 = _asyncToGenerator(function* (error, profile, account, OAuthProfile) {
            try {
              if (error) {
                _logger.default.error('CALLBACK_OAUTH_ERROR', error);

                return redirect("".concat(baseUrl).concat(basePath, "/error?error=oAuthCallback"));
              }

              _logger.default.debug('OAUTH_CALLBACK_RESPONSE', {
                profile,
                account,
                OAuthProfile
              });

              if (!profile) {
                return redirect("".concat(baseUrl).concat(basePath, "/signin"));
              }

              var userOrProfile = profile;

              if (adapter) {
                var {
                  getUserByProviderAccountId
                } = yield adapter.getAdapter(options);
                var userFromProviderAccountId = yield getUserByProviderAccountId(account.provider, account.id);

                if (userFromProviderAccountId) {
                  userOrProfile = userFromProviderAccountId;
                }
              }

              try {
                var signInCallbackResponse = yield callbacks.signIn(userOrProfile, account, OAuthProfile);

                if (signInCallbackResponse === false) {
                  return redirect("".concat(baseUrl).concat(basePath, "/error?error=AccessDenied"));
                }
              } catch (error) {
                if (error instanceof Error) {
                  return redirect("".concat(baseUrl).concat(basePath, "/error?error=").concat(encodeURIComponent(error)));
                } else {
                  return redirect(error);
                }
              }

              var {
                user,
                session,
                isNewUser
              } = yield (0, _callbackHandler.default)(sessionToken, profile, account, options);

              if (useJwtSession) {
                var defaultJwtPayload = {
                  name: user.name,
                  email: user.email,
                  picture: user.image
                };
                var jwtPayload = yield callbacks.jwt(defaultJwtPayload, user, account, OAuthProfile, isNewUser);
                var newEncodedJwt = yield jwt.encode(_objectSpread(_objectSpread({}, jwt), {}, {
                  token: jwtPayload
                }));
                var cookieExpires = new Date();
                cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);

                _cookie.default.set(res, cookies.sessionToken.name, newEncodedJwt, _objectSpread({
                  expires: cookieExpires.toISOString()
                }, cookies.sessionToken.options));
              } else {
                _cookie.default.set(res, cookies.sessionToken.name, session.sessionToken, _objectSpread({
                  expires: session.expires || null
                }, cookies.sessionToken.options));
              }

              yield (0, _dispatchEvent.default)(events.signIn, {
                user,
                account,
                isNewUser
              });

              if (isNewUser && pages.newUser) {
                return redirect(pages.newUser);
              }

              return redirect(callbackUrl || baseUrl);
            } catch (error) {
              if (error.name === 'AccountNotLinkedError') {
                return redirect("".concat(baseUrl).concat(basePath, "/error?error=OAuthAccountNotLinked"));
              } else if (error.name === 'CreateUserError') {
                return redirect("".concat(baseUrl).concat(basePath, "/error?error=OAuthCreateAccount"));
              } else {
                _logger.default.error('OAUTH_CALLBACK_HANDLER_ERROR', error);

                return redirect("".concat(baseUrl).concat(basePath, "/error?error=Callback"));
              }
            }
          });

          return function (_x5, _x6, _x7, _x8) {
            return _ref2.apply(this, arguments);
          };
        }());
      } catch (error) {
        _logger.default.error('OAUTH_CALLBACK_ERROR', error);

        return redirect("".concat(baseUrl).concat(basePath, "/error?error=Callback"));
      }
    } else if (type === 'email') {
      try {
        if (!adapter) {
          _logger.default.error('EMAIL_REQUIRES_ADAPTER_ERROR');

          return redirect("".concat(baseUrl).concat(basePath, "/error?error=Configuration"));
        }

        var {
          getVerificationRequest,
          deleteVerificationRequest,
          getUserByEmail
        } = yield adapter.getAdapter(options);
        var verificationToken = req.query.token;
        var email = req.query.email;
        var invite = yield getVerificationRequest(email, verificationToken, secret, provider);

        if (!invite) {
          return redirect("".concat(baseUrl).concat(basePath, "/error?error=Verification"));
        }

        yield deleteVerificationRequest(email, verificationToken, secret, provider);
        var profile = (yield getUserByEmail(email)) || {
          email
        };
        var account = {
          id: provider.id,
          type: 'email',
          providerAccountId: email
        };

        try {
          var signInCallbackResponse = yield callbacks.signIn(profile, account, {
            email
          });

          if (signInCallbackResponse === false) {
            return redirect("".concat(baseUrl).concat(basePath, "/error?error=AccessDenied"));
          }
        } catch (error) {
          if (error instanceof Error) {
            return redirect("".concat(baseUrl).concat(basePath, "/error?error=").concat(encodeURIComponent(error)));
          } else {
            return redirect(error);
          }
        }

        var {
          user,
          session,
          isNewUser
        } = yield (0, _callbackHandler.default)(sessionToken, profile, account, options);

        if (useJwtSession) {
          var defaultJwtPayload = {
            name: user.name,
            email: user.email,
            picture: user.image
          };
          var jwtPayload = yield callbacks.jwt(defaultJwtPayload, user, account, profile, isNewUser);
          var newEncodedJwt = yield jwt.encode(_objectSpread(_objectSpread({}, jwt), {}, {
            token: jwtPayload
          }));
          var cookieExpires = new Date();
          cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);

          _cookie.default.set(res, cookies.sessionToken.name, newEncodedJwt, _objectSpread({
            expires: cookieExpires.toISOString()
          }, cookies.sessionToken.options));
        } else {
          _cookie.default.set(res, cookies.sessionToken.name, session.sessionToken, _objectSpread({
            expires: session.expires || null
          }, cookies.sessionToken.options));
        }

        yield (0, _dispatchEvent.default)(events.signIn, {
          user,
          account,
          isNewUser
        });

        if (isNewUser && pages.newUser) {
          return redirect(pages.newUser);
        }

        if (callbackUrl) {
          return redirect(callbackUrl);
        } else {
          return redirect(baseUrl);
        }
      } catch (error) {
        if (error.name === 'CreateUserError') {
          return redirect("".concat(baseUrl).concat(basePath, "/error?error=EmailCreateAccount"));
        } else {
          _logger.default.error('CALLBACK_EMAIL_ERROR', error);

          return redirect("".concat(baseUrl).concat(basePath, "/error?error=Callback"));
        }
      }
    } else if (type === 'credentials' && req.method === 'POST') {
      if (!useJwtSession) {
        _logger.default.error('CALLBACK_CREDENTIALS_JWT_ERROR', 'Signin in with credentials is only supported if JSON Web Tokens are enabled');

        return redirect("".concat(baseUrl).concat(basePath, "/error?error=Configuration"));
      }

      if (!provider.authorize) {
        _logger.default.error('CALLBACK_CREDENTIALS_HANDLER_ERROR', 'Must define an authorize() handler to use credentials authentication provider');

        return redirect("".concat(baseUrl).concat(basePath, "/error?error=Configuration"));
      }

      var credentials = req.body;
      var userObjectReturnedFromAuthorizeHandler;

      try {
        userObjectReturnedFromAuthorizeHandler = yield provider.authorize(credentials);

        if (!userObjectReturnedFromAuthorizeHandler) {
          return redirect("".concat(baseUrl).concat(basePath, "/error?error=CredentialsSignin&provider=").concat(encodeURIComponent(provider.id)));
        }
      } catch (error) {
        if (error instanceof Error) {
          return redirect("".concat(baseUrl).concat(basePath, "/error?error=").concat(encodeURIComponent(error)));
        } else {
          return redirect(error);
        }
      }

      var _user = userObjectReturnedFromAuthorizeHandler;
      var _account = {
        id: provider.id,
        type: 'credentials'
      };

      try {
        var _signInCallbackResponse = yield callbacks.signIn(_user, _account, credentials);

        if (_signInCallbackResponse === false) {
          return redirect("".concat(baseUrl).concat(basePath, "/error?error=AccessDenied"));
        }
      } catch (error) {
        if (error instanceof Error) {
          return redirect("".concat(baseUrl).concat(basePath, "/error?error=").concat(encodeURIComponent(error)));
        } else {
          return redirect(error);
        }
      }

      var _defaultJwtPayload = {
        name: _user.name,
        email: _user.email,
        picture: _user.image
      };

      var _jwtPayload = yield callbacks.jwt(_defaultJwtPayload, _user, _account, userObjectReturnedFromAuthorizeHandler, false);

      var _newEncodedJwt = yield jwt.encode(_objectSpread(_objectSpread({}, jwt), {}, {
        token: _jwtPayload
      }));

      var _cookieExpires = new Date();

      _cookieExpires.setTime(_cookieExpires.getTime() + sessionMaxAge * 1000);

      _cookie.default.set(res, cookies.sessionToken.name, _newEncodedJwt, _objectSpread({
        expires: _cookieExpires.toISOString()
      }, cookies.sessionToken.options));

      yield (0, _dispatchEvent.default)(events.signIn, {
        user: _user,
        account: _account
      });
      return redirect(callbackUrl || baseUrl);
    } else {
      res.status(500).end("Error: Callback for provider type ".concat(type, " not supported"));
      return done();
    }
  });

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = _default;