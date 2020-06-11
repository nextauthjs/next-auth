export class User {
  constructor (name, email, image) {
    if (name) { this.name = name }
    if (email) { this.email = email }
    if (image) { this.image = image }

    const dateCreated = new Date()
    this.created = dateCreated.toISOString()
  }
}

export const UserSchema = {
  name: 'User',
  target: User,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    name: {
      type: 'varchar',
      nullable: true
    },
    email: {
      type: 'varchar',
      unique: true,
      nullable: true
    },
    image: {
      type: 'varchar',
      nullable: true
    },
    created: {
      type: 'timestamp'
    }
  }
}
