// This model is used for sign in emails, but is designed to support other
// mechanisms in future (e.g. 2FA via text message or short codes)
export class VerificationRequest {
  constructor (identifier, token, expires) {
    if (identifier) { this.identifier = identifier }
    if (token) { this.token = token }
    if (expires) { this.expires = expires }
  }
}

export const VerificationRequestSchema = {
  name: 'VerificationRequest',
  target: VerificationRequest,
  columns: {
    id: {
      // This property has `objectId: true` instead of `type: int` in MongoDB
      primary: true,
      type: 'int',
      generated: true
    },
    identifier: {
      // An email address, phone number, username or other unique identifier
      // associated with the request (used to track who it was on behalf of)
      type: 'varchar'
    },
    token: {
      // The token used verify the request (maybe hashed or encrypted)
      type: 'varchar',
      unique: true
    },
    expires: {
      // After this time, the request will no longer ve valid
      type: 'timestamp'
    },
    created: {
      type: 'timestamp',
      createDate: true
    },
    updated: {
      type: 'timestamp',
      updateDate: true
    }
  }
}
