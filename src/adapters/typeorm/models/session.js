import { randomBytes } from 'crypto'

export class Session {
  constructor (userId) {
    // @TODO expose max session duration as option and sync with client and cookie expiry
    const dateExpires = new Date()
    dateExpires.setDate(dateExpires.getDate() + 30) // 30 days

    this.userId = userId
    this.sessionToken = randomBytes(32).toString('hex')
    this.sessionExpires = dateExpires.toISOString()
    this.accessToken = randomBytes(32).toString('hex')
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
