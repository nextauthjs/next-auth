import { createHash } from 'crypto'

export class Account {
  constructor (
    userId,
    providerId,
    providerType,
    providerAccountId,
    refreshToken,
    accessToken,
    accessTokenExpires
  ) {
    // The compound ID ensures there is only one entry for a given provider and account
    this.compoundId = createHash('sha256').update(`${providerId}:${providerAccountId}`).digest('hex')
    this.userId = userId
    this.providerId = providerId
    this.providerType = providerType
    this.providerAccountId = providerAccountId
    this.refreshToken = refreshToken
    this.accessToken = accessToken
    this.accessTokenExpires = accessTokenExpires
  }
}

export const AccountSchema = {
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
    providerId: {
      type: 'varchar'
    },
    providerType: {
      type: 'varchar'
    },
    providerAccountId: {
      type: 'varchar'
    },
    refreshToken: {
      type: 'text',
      nullable: true
    },
    // Note: AccessTokens are not updated by NextAuth.js
    accessToken: {
      type: 'text'
    },
    // Note: AccessToken expiry is not recorded by  by NextAuth.js
    accessTokenExpires: {
      type: 'timestamp',
      nullable: true
    }
  }
}
