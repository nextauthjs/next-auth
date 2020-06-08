export class User {
  constructor (name, email, image) {
    this.name = name
    this.email = email
    this.image = image

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
      unique: true
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
