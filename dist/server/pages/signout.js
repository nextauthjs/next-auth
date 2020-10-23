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
    baseUrl,
    basePath,
    csrfToken
  } = _ref;
  return (0, _preactRenderToString.default)((0, _preact.h)("div", {
    className: "signout"
  }, (0, _preact.h)("h1", null, "Are you sure you want to sign out?"), (0, _preact.h)("form", {
    action: "".concat(baseUrl).concat(basePath, "/signout"),
    method: "POST"
  }, (0, _preact.h)("input", {
    type: "hidden",
    name: "csrfToken",
    value: csrfToken
  }), (0, _preact.h)("button", {
    type: "submit"
  }, "Sign out"))));
};

exports.default = _default;