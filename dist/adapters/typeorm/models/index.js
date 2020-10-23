"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _account = require("./account");

var _user = require("./user");

var _session = require("./session");

var _verificationRequest = require("./verification-request");

var _default = {
  Account: {
    model: _account.Account,
    schema: _account.AccountSchema
  },
  User: {
    model: _user.User,
    schema: _user.UserSchema
  },
  Session: {
    model: _session.Session,
    schema: _session.SessionSchema
  },
  VerificationRequest: {
    model: _verificationRequest.VerificationRequest,
    schema: _verificationRequest.VerificationRequestSchema
  }
};
exports.default = _default;