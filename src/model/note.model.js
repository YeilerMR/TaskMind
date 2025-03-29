import { DataTypes } from "sequelize";
import dbConnection from "../database/dbConnection.js";
import Course from "./course.model.js";
import User from "./user.model.js";

const Note = dbConnection.define(
    "notes",
    {
        ID_STUDENT_NOTE: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        ID_USER: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "ID_USER"
            },
            allowNull: false,
        },
        ID_COURSE: {
            type: DataTypes.INTEGER,
            references: {
                model: Course,
                key: "ID_COURSE"
            },
            allowNull: false,
        },
        DSC_TITLE: {
            type: DataTypes.STRING(225),
            allowNull: false,
          },
          DSC_COMMENT: {
            type: DataTypes.STRING(1000),
            allowNull: false,
          },
          DATE_NOTE: {
            type: DataTypes.STRING(255),
            allowNull: false,
          }
    },
     {
        timestamps: false,
        tableName: "tsim_student_class_note",
        
    }
    
);
Note.belongsTo(User, { foreignKey: "ID_USER" });
User.hasMany(Note, { foreignKey: "ID_USER" });

Note.belongsTo(Course, { foreignKey: "ID_COURSE" });
Course.hasMany(Note, { foreignKey: "ID_COURSE" });

export default Note;