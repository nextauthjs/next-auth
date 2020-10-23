"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var signIn = function () {
  var _ref = _asyncToGenerator(function* (profile, account, metadata) {
    var isAllowedToSignIn = true;

    if (isAllowedToSignIn) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  });

  return function signIn(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var redirect = function () {
  var _ref2 = _asyncToGenerator(function* (url, baseUrl) {
    return url.startsWith(baseUrl) ? Promise.resolve(url) : Promise.resolve(baseUrl);
  });

  return function redirect(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

var session = function () {
  var _ref3 = _asyncToGenerator(function* (_session, token) {
    return Promise.resolve(_session);
  });

  return function session(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();

var jwt = function () {
  var _ref4 = _asyncToGenerator(function* (token, oAuthProfile) {
    return Promise.resolve(token);
  });

  return function jwt(_x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();

var _default = {
  signIn,
  redirect,
  session,
  jwt
};
exports.default = _default;