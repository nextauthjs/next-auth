"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.server = exports.mockSignOutResponse = exports.mockEmailResponse = exports.mockCredentialsResponse = exports.mockGithubResponse = exports.mockCSRFToken = exports.mockProviders = exports.mockSession = void 0;

var _node = require("msw/node");

var _msw = require("msw");

var _crypto = require("crypto");

var mockSession = {
  ok: true,
  user: {
    image: null,
    name: "John",
    email: "john@email.com"
  },
  expires: 123213139
};
exports.mockSession = mockSession;
var mockProviders = {
  ok: true,
  github: {
    id: "github",
    name: "Github",
    type: "oauth",
    signinUrl: "path/to/signin",
    callbackUrl: "path/to/callback"
  },
  credentials: {
    id: "credentials",
    name: "Credentials",
    type: "credentials",
    authorize: null,
    credentials: null
  },
  email: {
    id: "email",
    type: "email",
    name: "Email"
  }
};
exports.mockProviders = mockProviders;
var mockCSRFToken = {
  ok: true,
  csrfToken: (0, _crypto.randomBytes)(32).toString("hex")
};
exports.mockCSRFToken = mockCSRFToken;
var mockGithubResponse = {
  ok: true,
  status: 200,
  url: "https://path/to/github/url"
};
exports.mockGithubResponse = mockGithubResponse;
var mockCredentialsResponse = {
  ok: true,
  status: 200,
  url: "https://path/to/credentials/url"
};
exports.mockCredentialsResponse = mockCredentialsResponse;
var mockEmailResponse = {
  ok: true,
  status: 200,
  url: "https://path/to/email/url"
};
exports.mockEmailResponse = mockEmailResponse;
var mockSignOutResponse = {
  ok: true,
  status: 200,
  url: "https://path/to/signout/url"
};
exports.mockSignOutResponse = mockSignOutResponse;
var server = (0, _node.setupServer)(_msw.rest.post("/api/auth/signout", function (req, res, ctx) {
  return res(ctx.status(200), ctx.json(mockSignOutResponse));
}), _msw.rest.get("/api/auth/session", function (req, res, ctx) {
  return res(ctx.status(200), ctx.json(mockSession));
}), _msw.rest.get("/api/auth/csrf", function (req, res, ctx) {
  return res(ctx.status(200), ctx.json(mockCSRFToken));
}), _msw.rest.get("/api/auth/providers", function (req, res, ctx) {
  return res(ctx.status(200), ctx.json(mockProviders));
}), _msw.rest.post("/api/auth/signin/github", function (req, res, ctx) {
  return res(ctx.status(200), ctx.json(mockGithubResponse));
}), _msw.rest.post("/api/auth/callback/credentials", function (req, res, ctx) {
  return res(ctx.status(200), ctx.json(mockCredentialsResponse));
}), _msw.rest.post("/api/auth/signin/email", function (req, res, ctx) {
  return res(ctx.status(200), ctx.json(mockEmailResponse));
}), _msw.rest.post("/api/auth/_log", function (req, res, ctx) {
  return res(ctx.status(200));
}));
exports.server = server;