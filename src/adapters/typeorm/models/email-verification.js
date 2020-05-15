export class EmailVerification {
  constructor (email, token) {
    // @TODO expose time to expire invite as option
    const dateExpires = new Date()
    dateExpires.setDate(dateExpires.getDate() + 1) // 1 day

    this.email = email
    this.token = token
    this.expires = dateExpires.toISOString()
  }
}

export const EmailVerificationSchema = {
  name: 'EmailVerification',
  target: EmailVerification,
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
      type: 'varchar',
      unique: true
    },
    expires: {
      type: 'date'
    }
  }
}
