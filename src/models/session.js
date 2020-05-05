import { randomBytes } from 'crypto'

export class Session {
  constructor(userId) {
    const date = new Date()
    const sessionExpiryInDays = 30
    const accessTokenExpiryInDays = 30

    this.id = randomBytes(32).toString('hex')
    this.user = userId 
    this.accessToken = randomBytes(32).toString('hex')
    this.accessTokenExpires = date.setDate(date.getDate() + accessTokenExpiryInDays) 
    this.expires = date.setDate(date.getDate() + sessionExpiryInDays) 
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
    user: {
      type: 'int'
    },
    accessToken: {
      type: 'varchar',
      unique: true
    },
    accessTokenExpires: {
      type: 'date',
    },
    expires: {
      type: 'date'
    }
  }
}
