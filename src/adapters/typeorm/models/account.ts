import { createHash } from 'crypto'

export class Account {
  compoundId: string;

  constructor (
    public userId: string,
    public providerId: string,
    // TODO: specify literals
    public providerType: string,
    public providerAccountId: string,
    public refreshToken: string,
    public accessToken: string,
    // TODO: figure out whether it is in fact a string
    public accessTokenExpires: string,
  ) {
    // The compound ID ensures there is only one entry for a given provider and account
    this.compoundId = createHash('sha256').update(`${providerId}:${providerAccountId}`).digest('hex')
  }
}

export const AccountSchema = {
  name: 'Account',
  target: Account,
  columns: {
    id: {
      // This property has `objectId: true` instead of `type: int` in MongoDB
      primary: true,
      type: 'int',
      generated: true
    },
    compoundId: {
      // The compound ID ensures that there there is only one instance of an
      // OAuth account in a way that works across different databases.
      // It is not used for anything else.
      type: 'varchar',
      unique: true
    },
    userId: {
      // This property is set to `type: objectId` on MongoDB databases
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
      // AccessTokens are not (yet) automatically rotated by NextAuth.js
      // You can update it using the refreshToken and the accessTokenUrl endpoint for the provider
      type: 'text',
      nullable: true
    },
    accessTokenExpires: {
      // AccessTokens expiry times are not (yet) updated by NextAuth.js
      // You can update it using the refreshToken and the accessTokenUrl endpoint for the provider
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
  indices: [
    {
      name: 'userId',
      columns: ['userId']
    },
    {
      name: 'providerId',
      columns: ['providerId']
    },
    {
      name: 'providerAccountId',
      columns: ['providerAccountId']
    }
  ]
} as const;