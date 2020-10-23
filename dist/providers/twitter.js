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
    id: 'twitter',
    name: 'Twitter',
    type: 'oauth',
    version: '1.0A',
    scope: '',
    accessTokenUrl: 'https://api.twitter.com/oauth/access_token',
    requestTokenUrl: 'https://api.twitter.com/oauth/request_token',
    authorizationUrl: 'https://api.twitter.com/oauth/authenticate',
    profileUrl: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
    profile: _profile => {
      return {
        id: _profile.id_str,
        name: _profile.name,
        email: _profile.email,
        image: _profile.profile_image_url_https.replace(/_normal\.jpg$/, '.jpg')
      };
    }
  }, options);
};

exports.default = _default;