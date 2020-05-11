import { randomBytes } from 'crypto'

export class Session {
  constructor (userId) {
    // Default to 30 days
    // @TODO expose as option and sync with client and sync with cookie expiry
    const dateSessionExpires = new Date()
    dateSessionExpires.setDate(dateSessionExpires.getDate() + 30)

    this.id = randomBytes(32).toString('hex')
    this.userId = userId
    this.accessToken = randomBytes(32).toString('hex')
    this.expires = dateSessionExpires.toISOString()
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
