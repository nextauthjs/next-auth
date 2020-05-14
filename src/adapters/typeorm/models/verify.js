import { createHash } from 'crypto'

export class Verify {
  constructor (email, token, salt) {
    // @TODO expose time to expire invite as option
    const dateExpires = new Date()
    dateExpires.setDate(dateExpires.getDate() + 1) // 1 day

    this.email = email
    this.token = createHash('sha256').update(`${token}${salt}`).digest('hex')
    this.expires = dateExpires.toISOString()
  }
}

export const VerifySchema = {
  name: 'Verify',
  target: Verify,
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
