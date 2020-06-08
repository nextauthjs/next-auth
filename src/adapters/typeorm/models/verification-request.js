export class VerificationRequest {
  constructor (identifer, token, expires) {
    this.identifer = identifer
    this.token = token
    this.expires = expires

    const dateCreated = new Date()
    this.created = dateCreated.toISOString()
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
    },
    created: {
      type: 'timestamp'
    }
  }
}
