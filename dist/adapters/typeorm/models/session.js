"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SessionSchema = exports.Session = void 0;

var _crypto = require("crypto");

class Session {
  constructor(userId, expires, sessionToken, accessToken) {
    this.userId = userId;
    this.expires = expires;
    this.sessionToken = sessionToken || (0, _crypto.randomBytes)(32).toString('hex');
    this.accessToken = accessToken || (0, _crypto.randomBytes)(32).toString('hex');
  }

}

exports.Session = Session;
var SessionSchema = {
  name: 'Session',
  target: Session,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    userId: {
      type: 'int'
    },
    expires: {
      type: 'timestamp'
    },
    sessionToken: {
      type: 'varchar',
      unique: true
    },
    accessToken: {
      type: 'varchar',
      unique: true
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
exports.SessionSchema = SessionSchema;