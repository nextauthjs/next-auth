export class User {
  constructor(name, email, image) {
    this.name = name
    this.email = email
    this.image = image
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
    }
  }
}
