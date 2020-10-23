"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = options => {
  return _objectSpread({
    id: 'apple',
    name: 'Apple',
    type: 'oauth',
    version: '2.0',
    scope: 'name email',
    params: {
      grant_type: 'authorization_code'
    },
    accessTokenUrl: 'https://appleid.apple.com/auth/token',
    authorizationUrl: 'https://appleid.apple.com/auth/authorize?response_type=code&id_token&response_mode=form_post',
    profileUrl: null,
    idToken: true,
    state: false,
    profile: _profile => {
      return {
        id: _profile.sub,
        name: _profile.user != null ? _profile.user.name.firstName + ' ' + _profile.user.name.lastName : null,
        email: _profile.email
      };
    },
    clientId: null,
    clientSecret: {
      appleId: null,
      teamId: null,
      privateKey: null,
      keyId: null
    },
    clientSecretCallback: function () {
      var _clientSecretCallback = _asyncToGenerator(function* (_ref) {
        var {
          appleId,
          keyId,
          teamId,
          privateKey
        } = _ref;

        var response = _jsonwebtoken.default.sign({
          iss: teamId,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 86400 * 180,
          aud: 'https://appleid.apple.com',
          sub: appleId
        }, privateKey.replace(/\\n/g, '\n'), {
          algorithm: 'ES256',
          keyid: keyId
        });

        return Promise.resolve(response);
      });

      function clientSecretCallback(_x) {
        return _clientSecretCallback.apply(this, arguments);
      }

      return clientSecretCallback;
    }()
  }, options);
};

exports.default = _default;