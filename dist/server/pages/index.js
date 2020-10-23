"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _signin = _interopRequireDefault(require("./signin"));

var _signout = _interopRequireDefault(require("./signout"));

var _verifyRequest = _interopRequireDefault(require("./verify-request"));

var _error = _interopRequireDefault(require("./error"));

var _css = _interopRequireDefault(require("../../css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function render(req, res, page, props, done) {
  var html = '';

  switch (page) {
    case 'signin':
      html = (0, _signin.default)(_objectSpread(_objectSpread({}, props), {}, {
        req
      }));
      break;

    case 'signout':
      html = (0, _signout.default)(props);
      break;

    case 'verify-request':
      html = (0, _verifyRequest.default)(props);
      break;

    case 'error':
      html = (0, _error.default)(_objectSpread(_objectSpread({}, props), {}, {
        res
      }));
      if (html === false) return done();
      break;

    default:
      html = (0, _error.default)(props);
      return;
  }

  res.setHeader('Content-Type', 'text/html');
  res.send("<!DOCTYPE html><head><style type=\"text/css\">".concat((0, _css.default)(), "</style><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"></head><body><div class=\"page\">").concat(html, "</div></body></html>"));
  done();
}

var _default = {
  render
};
exports.default = _default;