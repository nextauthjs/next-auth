"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NextAuth;

var _adapters = _interopRequireDefault(require("../adapters"));

var _jwt = _interopRequireDefault(require("../lib/jwt"));

var _parseUrl = _interopRequireDefault(require("../lib/parse-url"));

var _logger = _interopRequireWildcard(require("../lib/logger"));

var cookie = _interopRequireWildcard(require("./lib/cookie"));

var defaultEvents = _interopRequireWildcard(require("./lib/default-events"));

var defaultCallbacks = _interopRequireWildcard(require("./lib/default-callbacks"));

var _providers = _interopRequireDefault(require("./lib/providers"));

var routes = _interopRequireWildcard(require("./routes"));

var _pages = _interopRequireDefault(require("./pages"));

var _createSecret = _interopRequireDefault(require("./lib/create-secret"));

var _callbackUrlHandler = _interopRequireDefault(require("./lib/callback-url-handler"));

var _extendRes = _interopRequireDefault(require("./lib/extend-res"));

var _csrfTokenHandler = _interopRequireDefault(require("./lib/csrf-token-handler"));

var pkce = _interopRequireWildcard(require("./lib/oauth/pkce-handler"));

var state = _interopRequireWildcard(require("./lib/oauth/state-handler"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

if (!process.env.NEXTAUTH_URL) {
  _logger.default.warn("NEXTAUTH_URL", "NEXTAUTH_URL environment variable not set");
}

async function NextAuthHandler(req, res, userOptions) {
  if (userOptions.logger) {
    (0, _logger.setLogger)(userOptions.logger);
  }

  if (userOptions.debug) {
    process.env._NEXTAUTH_DEBUG = true;
  }

  return new Promise(async resolve => {
    var _provider$version, _userOptions$adapter;

    (0, _extendRes.default)(req, res, resolve);

    if (!req.query.nextauth) {
      const error = "Cannot find [...nextauth].js in pages/api/auth. Make sure the filename is written correctly.";

      _logger.default.error("MISSING_NEXTAUTH_API_ROUTE_ERROR", error);

      return res.status(500).end(`Error: ${error}`);
    }

    const {
      nextauth,
      action = nextauth[0],
      providerId = nextauth[1],
      error = nextauth[1]
    } = req.query;
    const {
      basePath,
      baseUrl
    } = (0, _parseUrl.default)(process.env.NEXTAUTH_URL || process.env.VERCEL_URL);
    const cookies = { ...cookie.defaultCookies(userOptions.useSecureCookies || baseUrl.startsWith("https://")),
      ...userOptions.cookies
    };
    const secret = (0, _createSecret.default)({
      userOptions,
      basePath,
      baseUrl
    });
    const providers = (0, _providers.default)({
      providers: userOptions.providers,
      baseUrl,
      basePath
    });
    const provider = providers.find(({
      id
    }) => id === providerId);

    if ((provider === null || provider === void 0 ? void 0 : provider.type) === "oauth" && (_provider$version = provider.version) !== null && _provider$version !== void 0 && _provider$version.startsWith("2")) {
      if (provider.protection) {
        provider.protection = Array.isArray(provider.protection) ? provider.protection : [provider.protection];
      } else if (provider.state !== undefined) {
        provider.protection = [provider.state ? "state" : "none"];
      } else {
        provider.protection = ["state"];
      }
    }

    const maxAge = 30 * 24 * 60 * 60;
    const adapter = (_userOptions$adapter = userOptions.adapter) !== null && _userOptions$adapter !== void 0 ? _userOptions$adapter : userOptions.database && _adapters.default.Default(userOptions.database);
    req.options = {
      debug: false,
      pages: {},
      theme: "auto",
      ...userOptions,
      adapter,
      baseUrl,
      basePath,
      action,
      provider,
      cookies,
      secret,
      providers,
      session: {
        jwt: !adapter,
        maxAge,
        updateAge: 24 * 60 * 60,
        ...userOptions.session
      },
      jwt: {
        secret,
        maxAge,
        encode: _jwt.default.encode,
        decode: _jwt.default.decode,
        ...userOptions.jwt
      },
      events: { ...defaultEvents,
        ...userOptions.events
      },
      callbacks: { ...defaultCallbacks,
        ...userOptions.callbacks
      },
      pkce: {},
      logger: _logger.default
    };
    (0, _csrfTokenHandler.default)(req, res);
    await (0, _callbackUrlHandler.default)(req, res);
    const render = (0, _pages.default)(req, res);
    const {
      pages
    } = req.options;

    if (req.method === "GET") {
      switch (action) {
        case "providers":
          return routes.providers(req, res);

        case "session":
          return routes.session(req, res);

        case "csrf":
          return res.json({
            csrfToken: req.options.csrfToken
          });

        case "signin":
          if (pages.signIn) {
            let signinUrl = `${pages.signIn}${pages.signIn.includes("?") ? "&" : "?"}callbackUrl=${req.options.callbackUrl}`;

            if (error) {
              signinUrl = `${signinUrl}&error=${error}`;
            }

            return res.redirect(signinUrl);
          }

          return render.signin();

        case "signout":
          if (pages.signOut) return res.redirect(pages.signOut);
          return render.signout();

        case "callback":
          if (provider) {
            if (await pkce.handleCallback(req, res)) return;
            if (await state.handleCallback(req, res)) return;
            return routes.callback(req, res);
          }

          break;

        case "verify-request":
          if (pages.verifyRequest) {
            return res.redirect(pages.verifyRequest);
          }

          return render.verifyRequest();

        case "error":
          if (pages.error) {
            return res.redirect(`${pages.error}${pages.error.includes("?") ? "&" : "?"}error=${error}`);
          }

          if (["Signin", "OAuthSignin", "OAuthCallback", "OAuthCreateAccount", "EmailCreateAccount", "Callback", "OAuthAccountNotLinked", "EmailSignin", "CredentialsSignin"].includes(error)) {
            return res.redirect(`${baseUrl}${basePath}/signin?error=${error}`);
          }

          return render.error({
            error
          });

        default:
      }
    } else if (req.method === "POST") {
      switch (action) {
        case "signin":
          if (req.options.csrfTokenVerified && provider) {
            if (await pkce.handleSignin(req, res)) return;
            if (await state.handleSignin(req, res)) return;
            return routes.signin(req, res);
          }

          return res.redirect(`${baseUrl}${basePath}/signin?csrf=true`);

        case "signout":
          if (req.options.csrfTokenVerified) {
            return routes.signout(req, res);
          }

          return res.redirect(`${baseUrl}${basePath}/signout?csrf=true`);

        case "callback":
          if (provider) {
            if (provider.type === "credentials" && !req.options.csrfTokenVerified) {
              return res.redirect(`${baseUrl}${basePath}/signin?csrf=true`);
            }

            if (await pkce.handleCallback(req, res)) return;
            if (await state.handleCallback(req, res)) return;
            return routes.callback(req, res);
          }

          break;

        case "_log":
          if (userOptions.logger) {
            try {
              const {
                code = "CLIENT_ERROR",
                level = "error",
                message = "[]"
              } = req.body;

              _logger.default[level](code, ...JSON.parse(message));
            } catch (error) {
              _logger.default.error("LOGGER_ERROR", error);
            }
          }

          return res.end();

        default:
      }
    }

    return res.status(400).end(`Error: HTTP ${req.method} is not supported for ${req.url}`);
  });
}

function NextAuth(...args) {
  if (args.length === 1) {
    return (req, res) => NextAuthHandler(req, res, args[0]);
  }

  return NextAuthHandler(...args);
}