export class EmailVerification {
  constructor (email, token, expires) {
    this.email = email
    this.token = token
    this.expires = expires
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
      type: 'timestamp'
    }
  }
}
