"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cookie = _interopRequireDefault(require("../lib/cookie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = function () {
  var _ref = _asyncToGenerator(function* (req, res, options) {
    var {
      query
    } = req;
    var {
      body
    } = req;
    var {
      cookies,
      baseUrl,
      defaultCallbackUrl,
      callbacks
    } = options;
    var callbackUrl = defaultCallbackUrl || baseUrl;
    var callbackUrlParamValue = body.callbackUrl || query.callbackUrl || null;
    var callbackUrlCookieValue = req.cookies[cookies.callbackUrl.name] || null;

    if (callbackUrlParamValue) {
      callbackUrl = yield callbacks.redirect(callbackUrlParamValue, baseUrl);
    } else if (callbackUrlCookieValue) {
      callbackUrl = yield callbacks.redirect(callbackUrlCookieValue, baseUrl);
    }

    if (callbackUrl && callbackUrl !== callbackUrlCookieValue) {
      _cookie.default.set(res, cookies.callbackUrl.name, callbackUrl, cookies.callbackUrl.options);
    }

    return Promise.resolve(callbackUrl);
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = _default;