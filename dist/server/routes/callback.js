"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = callback;

var _callback = _interopRequireDefault(require("../lib/oauth/callback"));

var _callbackHandler = _interopRequireDefault(require("../lib/callback-handler"));

var cookie = _interopRequireWildcard(require("../lib/cookie"));

var _dispatchEvent = _interopRequireDefault(require("../lib/dispatch-event"));

var _errorHandler = _interopRequireDefault(require("../../adapters/error-handler"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

async function callback(req, res) {
  var _req$cookies$cookies$, _req$cookies;

  const {
    provider,
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
    session: {
      jwt: useJwtSession,
      maxAge: sessionMaxAge
    },
    logger
  } = req.options;
  const sessionToken = (_req$cookies$cookies$ = (_req$cookies = req.cookies) === null || _req$cookies === void 0 ? void 0 : _req$cookies[cookies.sessionToken.name]) !== null && _req$cookies$cookies$ !== void 0 ? _req$cookies$cookies$ : null;

  if (provider.type === "oauth") {
    try {
      const {
        profile,
        account,
        OAuthProfile
      } = await (0, _callback.default)(req);

      try {
        logger.debug("OAUTH_CALLBACK_RESPONSE", {
          profile,
          account,
          OAuthProfile
        });

        if (!profile) {
          return res.redirect(`${baseUrl}${basePath}/signin`);
        }

        let userOrProfile = profile;

        if (adapter) {
          const {
            getUserByProviderAccountId
          } = (0, _errorHandler.default)(await adapter.getAdapter(req.options), logger);
          const userFromProviderAccountId = await getUserByProviderAccountId(account.provider, account.id);

          if (userFromProviderAccountId) {
            userOrProfile = userFromProviderAccountId;
          }
        }

        try {
          const signInCallbackResponse = await callbacks.signIn(userOrProfile, account, OAuthProfile);

          if (signInCallbackResponse === false) {
            return res.redirect(`${baseUrl}${basePath}/error?error=AccessDenied`);
          } else if (typeof signInCallbackResponse === "string") {
            return res.redirect(signInCallbackResponse);
          }
        } catch (error) {
          if (error instanceof Error) {
            return res.redirect(`${baseUrl}${basePath}/error?error=${encodeURIComponent(error.message)}`);
          }

          logger.warn("SIGNIN_CALLBACK_REJECT_REDIRECT");
          return res.redirect(error);
        }

        const {
          user,
          session,
          isNewUser
        } = await (0, _callbackHandler.default)(sessionToken, profile, account, req.options);

        if (useJwtSession) {
          var _user$id;

          const defaultJwtPayload = {
            name: user.name,
            email: user.email,
            picture: user.image,
            sub: (_user$id = user.id) === null || _user$id === void 0 ? void 0 : _user$id.toString()
          };
          const jwtPayload = await callbacks.jwt(defaultJwtPayload, user, account, OAuthProfile, isNewUser);
          const newEncodedJwt = await jwt.encode({ ...jwt,
            token: jwtPayload
          });
          const cookieExpires = new Date();
          cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);
          cookie.set(res, cookies.sessionToken.name, newEncodedJwt, {
            expires: cookieExpires.toISOString(),
            ...cookies.sessionToken.options
          });
        } else {
          cookie.set(res, cookies.sessionToken.name, session.sessionToken, {
            expires: session.expires || null,
            ...cookies.sessionToken.options
          });
        }

        await (0, _dispatchEvent.default)(events.signIn, {
          user,
          account,
          isNewUser
        });

        if (isNewUser && pages.newUser) {
          return res.redirect(`${pages.newUser}${pages.newUser.includes("?") ? "&" : "?"}callbackUrl=${encodeURIComponent(callbackUrl)}`);
        }

        return res.redirect(callbackUrl || baseUrl);
      } catch (error) {
        if (error.name === "AccountNotLinkedError") {
          return res.redirect(`${baseUrl}${basePath}/error?error=OAuthAccountNotLinked`);
        } else if (error.name === "CreateUserError") {
          return res.redirect(`${baseUrl}${basePath}/error?error=OAuthCreateAccount`);
        }

        logger.error("OAUTH_CALLBACK_HANDLER_ERROR", error);
        return res.redirect(`${baseUrl}${basePath}/error?error=Callback`);
      }
    } catch (error) {
      if (error.name === "OAuthCallbackError") {
        logger.error("CALLBACK_OAUTH_ERROR", error);
        return res.redirect(`${baseUrl}${basePath}/error?error=OAuthCallback`);
      }

      logger.error("OAUTH_CALLBACK_ERROR", error);
      return res.redirect(`${baseUrl}${basePath}/error?error=Callback`);
    }
  } else if (provider.type === "email") {
    try {
      if (!adapter) {
        logger.error("EMAIL_REQUIRES_ADAPTER_ERROR");
        return res.redirect(`${baseUrl}${basePath}/error?error=Configuration`);
      }

      const {
        getVerificationRequest,
        deleteVerificationRequest,
        getUserByEmail
      } = (0, _errorHandler.default)(await adapter.getAdapter(req.options), logger);
      const verificationToken = req.query.token;
      const email = req.query.email;
      const invite = await getVerificationRequest(email, verificationToken, secret, provider);

      if (!invite) {
        return res.redirect(`${baseUrl}${basePath}/error?error=Verification`);
      }

      await deleteVerificationRequest(email, verificationToken, secret, provider);
      const profile = (await getUserByEmail(email)) || {
        email
      };
      const account = {
        id: provider.id,
        type: "email",
        providerAccountId: email
      };

      try {
        const signInCallbackResponse = await callbacks.signIn(profile, account, {
          email
        });

        if (signInCallbackResponse === false) {
          return res.redirect(`${baseUrl}${basePath}/error?error=AccessDenied`);
        } else if (typeof signInCallbackResponse === "string") {
          return res.redirect(signInCallbackResponse);
        }
      } catch (error) {
        if (error instanceof Error) {
          return res.redirect(`${baseUrl}${basePath}/error?error=${encodeURIComponent(error.message)}`);
        }

        logger.warn("SIGNIN_CALLBACK_REJECT_REDIRECT");
        return res.redirect(error);
      }

      const {
        user,
        session,
        isNewUser
      } = await (0, _callbackHandler.default)(sessionToken, profile, account, req.options);

      if (useJwtSession) {
        var _user$id2;

        const defaultJwtPayload = {
          name: user.name,
          email: user.email,
          picture: user.image,
          sub: (_user$id2 = user.id) === null || _user$id2 === void 0 ? void 0 : _user$id2.toString()
        };
        const jwtPayload = await callbacks.jwt(defaultJwtPayload, user, account, profile, isNewUser);
        const newEncodedJwt = await jwt.encode({ ...jwt,
          token: jwtPayload
        });
        const cookieExpires = new Date();
        cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);
        cookie.set(res, cookies.sessionToken.name, newEncodedJwt, {
          expires: cookieExpires.toISOString(),
          ...cookies.sessionToken.options
        });
      } else {
        cookie.set(res, cookies.sessionToken.name, session.sessionToken, {
          expires: session.expires || null,
          ...cookies.sessionToken.options
        });
      }

      await (0, _dispatchEvent.default)(events.signIn, {
        user,
        account,
        isNewUser
      });

      if (isNewUser && pages.newUser) {
        return res.redirect(`${pages.newUser}${pages.newUser.includes("?") ? "&" : "?"}callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }

      return res.redirect(callbackUrl || baseUrl);
    } catch (error) {
      if (error.name === "CreateUserError") {
        return res.redirect(`${baseUrl}${basePath}/error?error=EmailCreateAccount`);
      }

      logger.error("CALLBACK_EMAIL_ERROR", error);
      return res.redirect(`${baseUrl}${basePath}/error?error=Callback`);
    }
  } else if (provider.type === "credentials" && req.method === "POST") {
    var _user$id3;

    if (!useJwtSession) {
      logger.error("CALLBACK_CREDENTIALS_JWT_ERROR", "Signin in with credentials is only supported if JSON Web Tokens are enabled");
      return res.status(500).redirect(`${baseUrl}${basePath}/error?error=Configuration`);
    }

    if (!provider.authorize) {
      logger.error("CALLBACK_CREDENTIALS_HANDLER_ERROR", "Must define an authorize() handler to use credentials authentication provider");
      return res.status(500).redirect(`${baseUrl}${basePath}/error?error=Configuration`);
    }

    const credentials = req.body;
    let userObjectReturnedFromAuthorizeHandler;

    try {
      userObjectReturnedFromAuthorizeHandler = await provider.authorize(credentials, { ...req,
        options: {},
        cookies: {}
      });

      if (!userObjectReturnedFromAuthorizeHandler) {
        return res.status(401).redirect(`${baseUrl}${basePath}/error?error=CredentialsSignin&provider=${encodeURIComponent(provider.id)}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.redirect(`${baseUrl}${basePath}/error?error=${encodeURIComponent(error.message)}`);
      }

      return res.redirect(error);
    }

    const user = userObjectReturnedFromAuthorizeHandler;
    const account = {
      id: provider.id,
      type: "credentials"
    };

    try {
      const signInCallbackResponse = await callbacks.signIn(user, account, credentials);

      if (signInCallbackResponse === false) {
        return res.status(403).redirect(`${baseUrl}${basePath}/error?error=AccessDenied`);
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.redirect(`${baseUrl}${basePath}/error?error=${encodeURIComponent(error.message)}`);
      }

      return res.redirect(error);
    }

    const defaultJwtPayload = {
      name: user.name,
      email: user.email,
      picture: user.image,
      sub: (_user$id3 = user.id) === null || _user$id3 === void 0 ? void 0 : _user$id3.toString()
    };
    const jwtPayload = await callbacks.jwt(defaultJwtPayload, user, account, userObjectReturnedFromAuthorizeHandler, false);
    const newEncodedJwt = await jwt.encode({ ...jwt,
      token: jwtPayload
    });
    const cookieExpires = new Date();
    cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);
    cookie.set(res, cookies.sessionToken.name, newEncodedJwt, {
      expires: cookieExpires.toISOString(),
      ...cookies.sessionToken.options
    });
    await (0, _dispatchEvent.default)(events.signIn, {
      user,
      account
    });
    return res.redirect(callbackUrl || baseUrl);
  }

  return res.status(500).end(`Error: Callback for provider type ${provider.type} not supported`);
}