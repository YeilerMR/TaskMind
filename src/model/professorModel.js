import { DataTypes } from "sequelize";
import dbConnection from "../database/dbConnection";

const Professor = dbConnection.define(
  "Professor",
  {
    ID_TEACHER: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    DSC_FIRST_NAME: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    DSC_LAST_NAME_ONE: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    DSC_LAST_NAME_TWO: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    DSC_EMAIL: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    DSC_PHONE: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    STATUS: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "dbo.tsit_teacher",
  }
);

export default Professor;
