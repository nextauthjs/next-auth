import { DataTypes } from "sequelize"

export const Account = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: { type: DataTypes.STRING, allowNull: false },
  provider: { type: DataTypes.STRING, allowNull: false },
  providerAccountId: { type: DataTypes.STRING, allowNull: false },
  refresh_token: { type: DataTypes.STRING },
  access_token: { type: DataTypes.STRING },
  expires_at: { type: DataTypes.INTEGER },
  token_type: { type: DataTypes.STRING },
  scope: { type: DataTypes.STRING },
  id_token: { type: DataTypes.STRING },
  session_state: { type: DataTypes.STRING },
  userId: { type: DataTypes.UUID },
}

export const User = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: "email" },
  emailVerified: { type: DataTypes.DATE },
  image: { type: DataTypes.STRING },
}

export const Session = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  expires: { type: DataTypes.DATE, allowNull: false },
  sessionToken: {
    type: DataTypes.STRING,
    unique: "sessionToken",
    allowNull: false,
  },
  userId: { type: DataTypes.UUID },
}

export const VerificationToken = {
  token: { type: DataTypes.STRING, primaryKey: true },
  identifier: { type: DataTypes.STRING, allowNull: false },
  expires: { type: DataTypes.DATE, allowNull: false },
}
