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
    this.providerCompoundId = createHash('sha256').update(`${providerId}:${providerAccountId}`).digest('hex')
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
    providerCompoundId: {
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
    accessToken: {
      type: 'text'
    },
    // @TODO AccessToken expiry is not yet tracked (varies across providers)
    accessTokenExpires: {
      type: 'timestamp',
      nullable: true
    }
  }
}
