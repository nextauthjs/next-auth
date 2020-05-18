import { randomBytes } from 'crypto'

export class Session {
  constructor (userId, sessionToken, sessionExpires, accessToken) {
    // Defaults to 30 days for expiry if sessionExpires not specified
    if (!sessionExpires) {
      const dateExpires = new Date()
      dateExpires.setDate(dateExpires.getDate() + 30)
      sessionExpires = dateExpires.toISOString()
    }

    this.userId = userId
    this.sessionToken = sessionToken || randomBytes(32).toString('hex')
    this.sessionExpires = sessionExpires
    this.accessToken = accessToken || randomBytes(32).toString('hex')
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
    sessionToken: {
      type: 'varchar',
      unique: true
    },
    sessionExpires: {
      type: 'date'
    },
    accessToken: {
      type: 'varchar',
      unique: true
    }
  }
}
