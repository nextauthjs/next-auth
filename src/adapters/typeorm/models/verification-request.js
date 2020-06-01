export class VerificationRequest {
  constructor (identifer, token, expires) {
    this.identifer = identifer
    this.token = token
    this.expires = expires
  }
}

export const VerificationRequestSchema = {
  name: 'VerificationRequest',
  target: VerificationRequest,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    identifer: {
      type: 'text'
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
