"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteVerificationRequestError = exports.GetVerificationRequestError = exports.CreateVerificationRequestError = exports.DeleteSessionError = exports.UpdateSessionError = exports.GetSessionError = exports.CreateSessionError = exports.UnlinkAccountError = exports.LinkAccountError = exports.DeleteUserError = exports.UpdateUserError = exports.GetUserByProviderAccountIdError = exports.GetUserByIdError = exports.GetUserByEmailError = exports.GetUserError = exports.CreateUserError = exports.AccountNotLinkedError = exports.OAuthCallbackError = exports.UnknownError = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

class UnknownError extends Error {
  constructor(error) {
    var _error$message;

    super((_error$message = error === null || error === void 0 ? void 0 : error.message) !== null && _error$message !== void 0 ? _error$message : error);
    this.name = "UnknownError";

    if (error instanceof Error) {
      this.stack = error.stack;
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack
    };
  }

}

exports.UnknownError = UnknownError;

class OAuthCallbackError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "OAuthCallbackError");
  }

}

exports.OAuthCallbackError = OAuthCallbackError;

class AccountNotLinkedError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "AccountNotLinkedError");
  }

}

exports.AccountNotLinkedError = AccountNotLinkedError;

class CreateUserError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "CreateUserError");
  }

}

exports.CreateUserError = CreateUserError;

class GetUserError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "GetUserError");
  }

}

exports.GetUserError = GetUserError;

class GetUserByEmailError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "GetUserByEmailError");
  }

}

exports.GetUserByEmailError = GetUserByEmailError;

class GetUserByIdError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "GetUserByIdError");
  }

}

exports.GetUserByIdError = GetUserByIdError;

class GetUserByProviderAccountIdError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "GetUserByProviderAccountIdError");
  }

}

exports.GetUserByProviderAccountIdError = GetUserByProviderAccountIdError;

class UpdateUserError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "UpdateUserError");
  }

}

exports.UpdateUserError = UpdateUserError;

class DeleteUserError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "DeleteUserError");
  }

}

exports.DeleteUserError = DeleteUserError;

class LinkAccountError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "LinkAccountError");
  }

}

exports.LinkAccountError = LinkAccountError;

class UnlinkAccountError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "UnlinkAccountError");
  }

}

exports.UnlinkAccountError = UnlinkAccountError;

class CreateSessionError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "CreateSessionError");
  }

}

exports.CreateSessionError = CreateSessionError;

class GetSessionError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "GetSessionError");
  }

}

exports.GetSessionError = GetSessionError;

class UpdateSessionError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "UpdateSessionError");
  }

}

exports.UpdateSessionError = UpdateSessionError;

class DeleteSessionError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "DeleteSessionError");
  }

}

exports.DeleteSessionError = DeleteSessionError;

class CreateVerificationRequestError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "CreateVerificationRequestError");
  }

}

exports.CreateVerificationRequestError = CreateVerificationRequestError;

class GetVerificationRequestError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "GetVerificationRequestError");
  }

}

exports.GetVerificationRequestError = GetVerificationRequestError;

class DeleteVerificationRequestError extends UnknownError {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", "DeleteVerificationRequestError");
  }

}

exports.DeleteVerificationRequestError = DeleteVerificationRequestError;