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
      adapter,
      cookies,
      events,
      jwt,
      callbackUrl,
      redirect
    } = options;
    var useJwtSession = options.session.jwt;
    var sessionToken = req.cookies[cookies.sessionToken.name];

    if (useJwtSession) {
      try {
        var decodedJwt = yield jwt.decode(_objectSpread(_objectSpread({}, jwt), {}, {
          token: sessionToken
        }));
        yield (0, _dispatchEvent.default)(events.signOut, decodedJwt);
      } catch (error) {}
    } else {
      var {
        getSession,
        deleteSession
      } = yield adapter.getAdapter(options);

      try {
        var session = yield getSession(sessionToken);
        yield (0, _dispatchEvent.default)(events.signOut, session);
      } catch (error) {}

      try {
        yield deleteSession(sessionToken);
      } catch (error) {
        _logger.default.error('SIGNOUT_ERROR', error);
      }
    }

    _cookie.default.set(res, cookies.sessionToken.name, '', _objectSpread(_objectSpread({}, cookies.sessionToken.options), {}, {
      maxAge: 0
    }));

    return redirect(callbackUrl);
  });

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = _default;