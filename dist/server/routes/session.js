"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = session;

var cookie = _interopRequireWildcard(require("../lib/cookie"));

var _dispatchEvent = _interopRequireDefault(require("../lib/dispatch-event"));

var _errorHandler = _interopRequireDefault(require("../../adapters/error-handler"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

async function session(req, res) {
  const {
    cookies,
    adapter,
    jwt,
    events,
    callbacks,
    logger
  } = req.options;
  const useJwtSession = req.options.session.jwt;
  const sessionMaxAge = req.options.session.maxAge;
  const sessionToken = req.cookies[cookies.sessionToken.name];

  if (!sessionToken) {
    return res.json({});
  }

  let response = {};

  if (useJwtSession) {
    try {
      const decodedJwt = await jwt.decode({ ...jwt,
        token: sessionToken
      });
      const sessionExpiresDate = new Date();
      sessionExpiresDate.setTime(sessionExpiresDate.getTime() + sessionMaxAge * 1000);
      const sessionExpires = sessionExpiresDate.toISOString();
      const defaultSessionPayload = {
        user: {
          name: decodedJwt.name || null,
          email: decodedJwt.email || null,
          image: decodedJwt.picture || null
        },
        expires: sessionExpires
      };
      const jwtPayload = await callbacks.jwt(decodedJwt);
      const sessionPayload = await callbacks.session(defaultSessionPayload, jwtPayload);
      response = sessionPayload;
      const newEncodedJwt = await jwt.encode({ ...jwt,
        token: jwtPayload
      });
      cookie.set(res, cookies.sessionToken.name, newEncodedJwt, {
        expires: sessionExpires,
        ...cookies.sessionToken.options
      });
      await (0, _dispatchEvent.default)(events.session, {
        session: sessionPayload,
        jwt: jwtPayload
      });
    } catch (error) {
      logger.error("JWT_SESSION_ERROR", error);
      cookie.set(res, cookies.sessionToken.name, "", { ...cookies.sessionToken.options,
        maxAge: 0
      });
    }
  } else {
    try {
      const {
        getUser,
        getSession,
        updateSession
      } = (0, _errorHandler.default)(await adapter.getAdapter(req.options), logger);
      const session = await getSession(sessionToken);

      if (session) {
        await updateSession(session);
        const user = await getUser(session.userId);
        const defaultSessionPayload = {
          user: {
            name: user.name,
            email: user.email,
            image: user.image
          },
          accessToken: session.accessToken,
          expires: session.expires
        };
        const sessionPayload = await callbacks.session(defaultSessionPayload, user);
        response = sessionPayload;
        cookie.set(res, cookies.sessionToken.name, sessionToken, {
          expires: session.expires,
          ...cookies.sessionToken.options
        });
        await (0, _dispatchEvent.default)(events.session, {
          session: sessionPayload
        });
      } else if (sessionToken) {
        cookie.set(res, cookies.sessionToken.name, "", { ...cookies.sessionToken.options,
          maxAge: 0
        });
      }
    } catch (error) {
      logger.error("SESSION_ERROR", error);
    }
  }

  res.json(response);
}