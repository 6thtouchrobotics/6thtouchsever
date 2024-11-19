import { DataTypes } from "sequelize";
import { database } from "../util/util.js";

const Courses = database.define("Courses", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  subscribers: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reviews: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
});

export default Courses;
