"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerificationRequestSchema = exports.VerificationRequest = void 0;

class VerificationRequest {
  constructor(identifier, token, expires) {
    if (identifier) {
      this.identifier = identifier;
    }

    if (token) {
      this.token = token;
    }

    if (expires) {
      this.expires = expires;
    }
  }

}

exports.VerificationRequest = VerificationRequest;
var VerificationRequestSchema = {
  name: 'VerificationRequest',
  target: VerificationRequest,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    identifier: {
      type: 'varchar'
    },
    token: {
      type: 'varchar',
      unique: true
    },
    expires: {
      type: 'timestamp'
    },
    createdAt: {
      type: 'timestamp',
      createDate: true
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true
    }
  }
};
exports.VerificationRequestSchema = VerificationRequestSchema;