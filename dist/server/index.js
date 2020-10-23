"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = require("crypto");

var _jwt = _interopRequireDefault(require("../lib/jwt"));

var _parseUrl = _interopRequireDefault(require("../lib/parse-url"));

var _cookie = _interopRequireDefault(require("./lib/cookie"));

var _callbackUrlHandler = _interopRequireDefault(require("./lib/callback-url-handler"));

var _providers = _interopRequireDefault(require("./lib/providers"));

var _events = _interopRequireDefault(require("./lib/events"));

var _callbacks = _interopRequireDefault(require("./lib/callbacks"));

var _providers2 = _interopRequireDefault(require("./routes/providers"));

var _signin = _interopRequireDefault(require("./routes/signin"));

var _signout = _interopRequireDefault(require("./routes/signout"));

var _callback = _interopRequireDefault(require("./routes/callback"));

var _session = _interopRequireDefault(require("./routes/session"));

var _pages = _interopRequireDefault(require("./pages"));

var _adapters = _interopRequireDefault(require("../adapters"));

var _logger = _interopRequireDefault(require("../lib/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

if (!process.env.NEXTAUTH_URL) {
  _logger.default.warn('NEXTAUTH_URL', 'NEXTAUTH_URL environment variable not set');
}

var _default = function () {
  var _ref = _asyncToGenerator(function* (req, res, userSuppliedOptions) {
    return new Promise(function () {
      var _ref2 = _asyncToGenerator(function* (resolve) {
        var done = resolve;
        var {
          url,
          query,
          body
        } = req;
        var {
          nextauth,
          action = nextauth[0],
          provider = nextauth[1],
          error = nextauth[1]
        } = query;
        var {
          csrfToken: csrfTokenFromPost
        } = body;
        var parsedUrl = (0, _parseUrl.default)(process.env.NEXTAUTH_URL || process.env.VERCEL_URL);
        var baseUrl = parsedUrl.baseUrl;
        var basePath = parsedUrl.basePath;
        var adapter;

        if (userSuppliedOptions.adapter) {
          adapter = userSuppliedOptions.adapter;
        } else if (userSuppliedOptions.database) {
          adapter = _adapters.default.Default(userSuppliedOptions.database);
        }

        var secret = userSuppliedOptions.secret || (0, _crypto.createHash)('sha256').update(JSON.stringify(_objectSpread({
          baseUrl,
          basePath
        }, userSuppliedOptions))).digest('hex');
        var useSecureCookies = userSuppliedOptions.useSecureCookies || baseUrl.startsWith('https://');
        var cookiePrefix = useSecureCookies ? '__Secure-' : '';

        var cookies = _objectSpread({
          sessionToken: {
            name: "".concat(cookiePrefix, "next-auth.session-token"),
            options: {
              httpOnly: true,
              sameSite: 'lax',
              path: '/',
              secure: useSecureCookies
            }
          },
          callbackUrl: {
            name: "".concat(cookiePrefix, "next-auth.callback-url"),
            options: {
              sameSite: 'lax',
              path: '/',
              secure: useSecureCookies
            }
          },
          csrfToken: {
            name: "".concat(useSecureCookies ? '__Host-' : '', "next-auth.csrf-token"),
            options: {
              httpOnly: true,
              sameSite: 'lax',
              path: '/',
              secure: useSecureCookies
            }
          }
        }, userSuppliedOptions.cookies);

        var sessionOptions = _objectSpread({
          jwt: false,
          maxAge: 30 * 24 * 60 * 60,
          updateAge: 24 * 60 * 60
        }, userSuppliedOptions.session);

        var jwtOptions = _objectSpread({
          secret,
          maxAge: sessionOptions.maxAge,
          encode: _jwt.default.encode,
          decode: _jwt.default.decode
        }, userSuppliedOptions.jwt);

        if (!adapter) {
          sessionOptions.jwt = true;
        }

        var eventsOptions = _objectSpread(_objectSpread({}, _events.default), userSuppliedOptions.events);

        var callbacksOptions = _objectSpread(_objectSpread({}, _callbacks.default), userSuppliedOptions.callbacks);

        var csrfToken;
        var csrfTokenVerified = false;

        if (req.cookies[cookies.csrfToken.name]) {
          var [csrfTokenValue, csrfTokenHash] = req.cookies[cookies.csrfToken.name].split('|');

          if (csrfTokenHash === (0, _crypto.createHash)('sha256').update("".concat(csrfTokenValue).concat(secret)).digest('hex')) {
            csrfToken = csrfTokenValue;

            if (req.method === 'POST' && csrfToken === csrfTokenFromPost) {
              csrfTokenVerified = true;
            }
          }
        }

        if (!csrfToken) {
          csrfToken = (0, _crypto.randomBytes)(32).toString('hex');
          var newCsrfTokenCookie = "".concat(csrfToken, "|").concat((0, _crypto.createHash)('sha256').update("".concat(csrfToken).concat(secret)).digest('hex'));

          _cookie.default.set(res, cookies.csrfToken.name, newCsrfTokenCookie, cookies.csrfToken.options);
        }

        var redirect = redirectUrl => {
          var reponseAsJson = !!(req.body && req.body.json === 'true');

          if (reponseAsJson) {
            res.json({
              url: redirectUrl
            });
          } else {
            res.status(302).setHeader('Location', redirectUrl);
            res.end();
          }

          return done();
        };

        var options = _objectSpread(_objectSpread({
          debug: false,
          pages: {}
        }, userSuppliedOptions), {}, {
          adapter,
          baseUrl,
          basePath,
          action,
          provider,
          cookies,
          secret,
          csrfToken,
          providers: (0, _providers.default)(userSuppliedOptions.providers, baseUrl, basePath),
          session: sessionOptions,
          jwt: jwtOptions,
          events: eventsOptions,
          callbacks: callbacksOptions,
          callbackUrl: baseUrl,
          redirect
        });

        if (options.debug === true) {
          process.env._NEXTAUTH_DEBUG = true;
        }

        options.callbackUrl = yield (0, _callbackUrlHandler.default)(req, res, options);

        if (req.method === 'GET') {
          switch (action) {
            case 'providers':
              (0, _providers2.default)(req, res, options, done);
              break;

            case 'session':
              (0, _session.default)(req, res, options, done);
              break;

            case 'csrf':
              res.json({
                csrfToken
              });
              return done();

            case 'signin':
              if (options.pages.signIn) {
                var redirectUrl = "".concat(options.pages.signIn).concat(options.pages.signIn.includes('?') ? '&' : '?', "callbackUrl=").concat(options.callbackUrl);

                if (req.query.error) {
                  redirectUrl = "".concat(redirectUrl, "&error=").concat(req.query.error);
                }

                return redirect(redirectUrl);
              }

              _pages.default.render(req, res, 'signin', {
                baseUrl,
                basePath,
                providers: Object.values(options.providers),
                callbackUrl: options.callbackUrl,
                csrfToken
              }, done);

              break;

            case 'signout':
              if (options.pages.signOut) {
                return redirect("".concat(options.pages.signOut).concat(options.pages.signOut.includes('?') ? '&' : '?', "error=").concat(error));
              }

              _pages.default.render(req, res, 'signout', {
                baseUrl,
                basePath,
                csrfToken,
                callbackUrl: options.callbackUrl
              }, done);

              break;

            case 'callback':
              if (provider && options.providers[provider]) {
                (0, _callback.default)(req, res, options, done);
              } else {
                res.status(400).end("Error: HTTP GET is not supported for ".concat(url));
                return done();
              }

              break;

            case 'verify-request':
              if (options.pages.verifyRequest) {
                return redirect(options.pages.verifyRequest);
              }

              _pages.default.render(req, res, 'verify-request', {
                baseUrl
              }, done);

              break;

            case 'error':
              if (options.pages.error) {
                return redirect("".concat(options.pages.error).concat(options.pages.error.includes('?') ? '&' : '?', "error=").concat(error));
              }

              _pages.default.render(req, res, 'error', {
                baseUrl,
                basePath,
                error
              }, done);

              break;

            default:
              res.status(404).end();
              return done();
          }
        } else if (req.method === 'POST') {
          switch (action) {
            case 'signin':
              if (!csrfTokenVerified) {
                return redirect("".concat(baseUrl).concat(basePath, "/signin?csrf=true"));
              }

              if (provider && options.providers[provider]) {
                (0, _signin.default)(req, res, options, done);
              }

              break;

            case 'signout':
              if (!csrfTokenVerified) {
                return redirect("".concat(baseUrl).concat(basePath, "/signout?csrf=true"));
              }

              (0, _signout.default)(req, res, options, done);
              break;

            case 'callback':
              if (provider && options.providers[provider]) {
                if (options.providers[provider].type === 'credentials' && !csrfTokenVerified) {
                  return redirect("".concat(baseUrl).concat(basePath, "/signin?csrf=true"));
                }

                (0, _callback.default)(req, res, options, done);
              } else {
                res.status(400).end("Error: HTTP POST is not supported for ".concat(url));
                return done();
              }

              break;

            default:
              res.status(400).end("Error: HTTP POST is not supported for ".concat(url));
              return done();
          }
        } else {
          res.status(400).end("Error: HTTP ".concat(req.method, " is not supported for ").concat(url));
          return done();
        }
      });

      return function (_x4) {
        return _ref2.apply(this, arguments);
      };
    }());
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = _default;