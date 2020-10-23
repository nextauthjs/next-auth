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
    id: 'basecamp',
    name: 'Basecamp',
    type: 'oauth',
    version: '2.0',
    accessTokenUrl: 'https://launchpad.37signals.com/authorization/token?type=web_server',
    authorizationUrl: 'https://launchpad.37signals.com/authorization/new?type=web_server',
    profileUrl: 'https://launchpad.37signals.com/authorization.json',
    profile: _profile => {
      return {
        id: _profile.identity.id,
        name: "".concat(_profile.identity.first_name, " ").concat(_profile.identity.last_name),
        email: _profile.identity.email_address,
        image: null
      };
    }
  }, options);
};

exports.default = _default;