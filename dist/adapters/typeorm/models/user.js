"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserSchema = exports.User = void 0;

class User {
  constructor(name, email, password, image, emailVerified) {
    if (name) {
      this.name = name;
    }

    if (email) {
      this.email = email;
    }

    if (image) {
      this.image = image;
    }

    if (password) {
      this.password = password;
    }

    if (emailVerified) {
      var currentDate = new Date();
      this.emailVerified = currentDate;
    }
  }

}

exports.User = User;
var UserSchema = {
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
    password: {
      type: 'varchar',
      nullable: true
    },
    emailVerified: {
      type: 'timestamp',
      nullable: true
    },
    image: {
      type: 'varchar',
      nullable: true
    },
    createdAt: {
      type: 'timestamp',
      createDate: true
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true
    }
  }
};
exports.UserSchema = UserSchema;