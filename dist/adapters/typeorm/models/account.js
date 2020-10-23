"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AccountSchema = exports.Account = void 0;

var _crypto = require("crypto");

class Account {
  constructor(userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires) {
    this.compoundId = (0, _crypto.createHash)('sha256').update("".concat(providerId, ":").concat(providerAccountId)).digest('hex');
    this.userId = userId;
    this.providerType = providerType;
    this.providerId = providerId;
    this.providerAccountId = providerAccountId;
    this.refreshToken = refreshToken;
    this.accessToken = accessToken;
    this.accessTokenExpires = accessTokenExpires;
  }

}

exports.Account = Account;
var AccountSchema = {
  name: 'Account',
  target: Account,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    compoundId: {
      type: 'varchar',
      unique: true
    },
    userId: {
      type: 'int'
    },
    providerType: {
      type: 'varchar'
    },
    providerId: {
      type: 'varchar'
    },
    providerAccountId: {
      type: 'varchar'
    },
    refreshToken: {
      type: 'text',
      nullable: true
    },
    accessToken: {
      type: 'text',
      nullable: true
    },
    accessTokenExpires: {
      type: 'timestamp',
      nullable: true
    },
    createdAt: {
      type: 'timestamp',
      createDate: true
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true
    }
  },
  indices: [{
    name: 'userId',
    columns: ['userId']
  }, {
    name: 'providerId',
    columns: ['providerId']
  }, {
    name: 'providerAccountId',
    columns: ['providerAccountId']
  }]
};
exports.AccountSchema = AccountSchema;