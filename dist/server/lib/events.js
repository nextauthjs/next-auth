"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var signIn = function () {
  var _ref = _asyncToGenerator(function* (message) {});

  return function signIn(_x) {
    return _ref.apply(this, arguments);
  };
}();

var signOut = function () {
  var _ref2 = _asyncToGenerator(function* (message) {});

  return function signOut(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var createUser = function () {
  var _ref3 = _asyncToGenerator(function* (message) {});

  return function createUser(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var updateUser = function () {
  var _ref4 = _asyncToGenerator(function* (message) {});

  return function updateUser(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var linkAccount = function () {
  var _ref5 = _asyncToGenerator(function* (message) {});

  return function linkAccount(_x5) {
    return _ref5.apply(this, arguments);
  };
}();

var session = function () {
  var _ref6 = _asyncToGenerator(function* (message) {});

  return function session(_x6) {
    return _ref6.apply(this, arguments);
  };
}();

var error = function () {
  var _ref7 = _asyncToGenerator(function* (message) {});

  return function error(_x7) {
    return _ref7.apply(this, arguments);
  };
}();

var _default = {
  signIn,
  signOut,
  createUser,
  updateUser,
  linkAccount,
  session,
  error
};
exports.default = _default;