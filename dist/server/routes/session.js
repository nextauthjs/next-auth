"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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
      cookies,
      adapter,
      jwt,
      events,
      callbacks
    } = options;
    var useJwtSession = options.session.jwt;
    var sessionMaxAge = options.session.maxAge;
    var sessionToken = req.cookies[cookies.sessionToken.name];

    if (!sessionToken) {
      res.setHeader('Content-Type', 'application/json');
      res.json({});
      return done();
    }

    var response = {};

    if (useJwtSession) {
      try {
        var decodedJwt = yield jwt.decode(_objectSpread(_objectSpread({}, jwt), {}, {
          token: sessionToken
        }));
        var sessionExpiresDate = new Date();
        sessionExpiresDate.setTime(sessionExpiresDate.getTime() + sessionMaxAge * 1000);
        var sessionExpires = sessionExpiresDate.toISOString();
        var defaultSessionPayload = {
          user: {
            name: decodedJwt.name || null,
            email: decodedJwt.email || null,
            image: decodedJwt.picture || null
          },
          expires: sessionExpires
        };
        var jwtPayload = yield callbacks.jwt(decodedJwt);
        var sessionPayload = yield callbacks.session(defaultSessionPayload, jwtPayload);
        response = sessionPayload;
        var newEncodedJwt = yield jwt.encode(_objectSpread(_objectSpread({}, jwt), {}, {
          token: jwtPayload
        }));

        _cookie.default.set(res, cookies.sessionToken.name, newEncodedJwt, _objectSpread({
          expires: sessionExpires
        }, cookies.sessionToken.options));

        yield (0, _dispatchEvent.default)(events.session, {
          session: sessionPayload,
          jwt: jwtPayload
        });
      } catch (error) {
        _logger.default.error('JWT_SESSION_ERROR', error);

        _cookie.default.set(res, cookies.sessionToken.name, '', _objectSpread(_objectSpread({}, cookies.sessionToken.options), {}, {
          maxAge: 0
        }));
      }
    } else {
      try {
        var {
          getUser,
          getSession,
          updateSession
        } = yield adapter.getAdapter(options);
        var session = yield getSession(sessionToken);

        if (session) {
          yield updateSession(session);
          var user = yield getUser(session.userId);
          var _defaultSessionPayload = {
            user: {
              name: user.name,
              email: user.email,
              image: user.image
            },
            accessToken: session.accessToken,
            expires: session.expires
          };

          var _sessionPayload = yield callbacks.session(_defaultSessionPayload, user);

          response = _sessionPayload;

          _cookie.default.set(res, cookies.sessionToken.name, sessionToken, _objectSpread({
            expires: session.expires
          }, cookies.sessionToken.options));

          yield (0, _dispatchEvent.default)(events.session, {
            session: _sessionPayload
          });
        } else if (sessionToken) {
          _cookie.default.set(res, cookies.sessionToken.name, '', _objectSpread(_objectSpread({}, cookies.sessionToken.options), {}, {
            maxAge: 0
          }));
        }
      } catch (error) {
        _logger.default.error('SESSION_ERROR', error);
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.json(response);
    return done();
  });

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = _default;