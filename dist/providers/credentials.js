"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Credentials;

function Credentials(options) {
  return {
    id: "credentials",
    name: "Credentials",
    type: "credentials",
    authorize: null,
    credentials: null,
    ...options
  };
}