import { DataTypes } from "sequelize";
import { database } from "../util/util.js";
import { hashSync } from "bcrypt";

/**
 * User Model
 */
const User = database.define("user", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  avatar: DataTypes.STRING,
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: "Email as already been used.",
    },
    validate: {
      isEmail: {
        msg: "Enter a valid email",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue("password", hashSync(value, 10));
    },
  },
});

export default User;
