import { randomBytes } from 'crypto'

export class Session {
  constructor (userId) {
    // @TODO expose max session duration as option and sync with client and cookie expiry
    const dateExpires = new Date()
    dateExpires.setDate(dateExpires.getDate() + 30) // 30 days

    this.id = randomBytes(32).toString('hex')
    this.userId = userId
    this.accessToken = randomBytes(32).toString('hex')
    this.expires = dateExpires.toISOString()
  }
}

export const SessionSchema = {
  name: 'Session',
  target: Session,
  columns: {
    id: {
      type: 'varchar',
      primary: true,
      unique: true
    },
    userId: {
      type: 'int'
    },
    accessToken: {
      type: 'varchar',
      unique: true
    },
    expires: {
      type: 'date'
    }
  }
}
