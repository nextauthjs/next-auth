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
      type: 'varchar'
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
      type: 'varchar',
      nullable: true
    },
    accessToken: {
      type: 'varchar'
    },
    accessTokenExpires: {
      type: 'varchar',
      nullable: true
    }
  }
}
