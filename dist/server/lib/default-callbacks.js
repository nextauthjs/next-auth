"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signIn = signIn;
exports.redirect = redirect;
exports.session = session;
exports.jwt = jwt;

async function signIn() {
  return true;
}

async function redirect(url, baseUrl) {
  if (url.startsWith(baseUrl)) {
    return url;
  }

  return baseUrl;
}

async function session(session) {
  return session;
}

async function jwt(token) {
  return token;
}