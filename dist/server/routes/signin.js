"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = signin;

var _oauth = _interopRequireDefault(require("../lib/signin/oauth"));

var _email = _interopRequireDefault(require("../lib/signin/email"));

var _errorHandler = _interopRequireDefault(require("../../adapters/error-handler"));

async function signin(req, res) {
  const {
    provider,
    baseUrl,
    basePath,
    adapter,
    callbacks,
    logger
  } = req.options;

  if (!provider.type) {
    return res.status(500).end(`Error: Type not specified for ${provider.name}`);
  }

  if (provider.type === "oauth" && req.method === "POST") {
    try {
      const authorizationUrl = await (0, _oauth.default)(req);
      return res.redirect(authorizationUrl);
    } catch (error) {
      logger.error("SIGNIN_OAUTH_ERROR", error);
      return res.redirect(`${baseUrl}${basePath}/error?error=OAuthSignin`);
    }
  } else if (provider.type === "email" && req.method === "POST") {
    var _req$body$email$toLow, _req$body$email;

    if (!adapter) {
      logger.error("EMAIL_REQUIRES_ADAPTER_ERROR");
      return res.redirect(`${baseUrl}${basePath}/error?error=Configuration`);
    }

    const {
      getUserByEmail
    } = (0, _errorHandler.default)(await adapter.getAdapter(req.options), logger);
    const email = (_req$body$email$toLow = (_req$body$email = req.body.email) === null || _req$body$email === void 0 ? void 0 : _req$body$email.toLowerCase()) !== null && _req$body$email$toLow !== void 0 ? _req$body$email$toLow : null;
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
        email,
        verificationRequest: true
      });

      if (signInCallbackResponse === false) {
        return res.redirect(`${baseUrl}${basePath}/error?error=AccessDenied`);
      } else if (typeof signInCallbackResponse === "string") {
        return res.redirect(signInCallbackResponse);
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.redirect(`${baseUrl}${basePath}/error?error=${encodeURIComponent(error)}`);
      }

      logger.warn("SIGNIN_CALLBACK_REJECT_REDIRECT");
      return res.redirect(error);
    }

    try {
      await (0, _email.default)(email, provider, req.options);
    } catch (error) {
      logger.error("SIGNIN_EMAIL_ERROR", error);
      return res.redirect(`${baseUrl}${basePath}/error?error=EmailSignin`);
    }

    return res.redirect(`${baseUrl}${basePath}/verify-request?provider=${encodeURIComponent(provider.id)}&type=${encodeURIComponent(provider.type)}`);
  }

  return res.redirect(`${baseUrl}${basePath}/signin`);
}