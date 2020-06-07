import { randomBytes } from 'crypto'

export class Session {
  constructor (userId, expires, sessionToken, accessToken) {
    this.userId = userId
    this.expires = expires
    this.sessionToken = sessionToken || randomBytes(32).toString('hex')
    this.accessToken = accessToken || randomBytes(32).toString('hex')

    const dateCreated = new Date()
    this.created = dateCreated.toISOString()
  }
}

export const SessionSchema = {
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
    created: {
      type: 'timestamp'
    }
  }
}
