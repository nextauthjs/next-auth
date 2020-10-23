"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _preactRenderToString = _interopRequireDefault(require("preact-render-to-string"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (_ref) => {
  var {
    baseUrl
  } = _ref;
  return (0, _preactRenderToString.default)((0, _preact.h)("div", {
    className: "verify-request"
  }, (0, _preact.h)("h1", null, "Check your email"), (0, _preact.h)("p", null, "A sign in link has been sent to your email address."), (0, _preact.h)("p", null, (0, _preact.h)("a", {
    className: "site",
    href: baseUrl
  }, baseUrl.replace(/^https?:\/\//, '')))));
};

exports.default = _default;