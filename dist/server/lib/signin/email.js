"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = require("crypto");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = function () {
  var _ref = _asyncToGenerator(function* (email, provider, options) {
    try {
      var {
        baseUrl,
        basePath,
        adapter
      } = options;
      var {
        createVerificationRequest
      } = yield adapter.getAdapter(options);
      var secret = provider.secret || options.secret;
      var token = (0, _crypto.randomBytes)(32).toString('hex');
      var url = "".concat(baseUrl).concat(basePath, "/callback/").concat(encodeURIComponent(provider.id), "?email=").concat(encodeURIComponent(email), "&token=").concat(encodeURIComponent(token));
      yield createVerificationRequest(email, url, token, secret, provider, options);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = _default;