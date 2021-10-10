"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = signout;

var _preact = require("preact");

function signout({
  baseUrl,
  basePath,
  csrfToken
}) {
  return (0, _preact.h)("div", {
    className: "signout"
  }, (0, _preact.h)("h1", null, "Are you sure you want to sign out?"), (0, _preact.h)("form", {
    action: `${baseUrl}${basePath}/signout`,
    method: "POST"
  }, (0, _preact.h)("input", {
    type: "hidden",
    name: "csrfToken",
    value: csrfToken
  }), (0, _preact.h)("button", {
    type: "submit"
  }, "Sign out")));
}