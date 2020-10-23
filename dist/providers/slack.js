"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = options => {
  return _objectSpread({
    id: 'slack',
    name: 'Slack',
    type: 'oauth',
    version: '2.0',
    scope: 'identity.basic identity.email identity.avatar',
    params: {
      grant_type: 'authorization_code'
    },
    accessTokenUrl: 'https://slack.com/api/oauth.access',
    authorizationUrl: 'https://slack.com/oauth/authorize?response_type=code',
    profileUrl: 'https://slack.com/api/users.identity',
    profile: _profile => {
      var {
        user
      } = _profile;
      return {
        id: user.id,
        name: user.name,
        image: user.image_512,
        email: user.email
      };
    }
  }, options);
};

exports.default = _default;