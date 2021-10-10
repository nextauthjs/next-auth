"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = verifyRequest;

var _preact = require("preact");

function verifyRequest({
  baseUrl
}) {
  return (0, _preact.h)("div", {
    className: "verify-request"
  }, (0, _preact.h)("h1", null, "Check your email"), (0, _preact.h)("p", null, "A sign in link has been sent to your email address."), (0, _preact.h)("p", null, (0, _preact.h)("a", {
    className: "site",
    href: baseUrl
  }, baseUrl.replace(/^https?:\/\//, ''))));
}