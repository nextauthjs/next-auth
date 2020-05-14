import { createHash } from 'crypto'

export class Invite {
  constructor (email, token, salt) {
    // @TODO expose time to expire invite as option
    const dateExpires = new Date()
    dateExpires.setDate(dateExpires.getDate() + 1) // 1 day

    this.email = email
    this.token = createHash('sha256').update(`${token}${salt}`).digest('hex')
    this.expires = dateExpires.toISOString()
  }
}

export const InviteSchema = {
  name: 'Invite',
  target: Invite,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    email: {
      type: 'varchar'
    },
    token: {
      type: 'varchar'
    },
    expires: {
      type: 'date'
    }
  }
}
