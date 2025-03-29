import { DataTypes } from "sequelize";
import dbConnection from "../database/dbConnection.js";
import Professor from "./professorModel.js";
import User from "./user.model.js";

const Course = dbConnection.define(
    "Course",
    {
        ID_COURSE: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        DSC_NAME: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        ID_TEACHER: {
            type: DataTypes.INTEGER,
            references: {
                model: Professor,
                key: "ID_TEACHER"
            },
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
        DSC_CODE: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        DSC_ATTENTION: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        DSC_COLOR: {
            type: DataTypes.STRING(8),
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "tsim_course",
        schema: "dbo",
    }
);

Course.belongsTo(User, { foreignKey: "ID_USER" });
User.hasMany(Course, { foreignKey: "ID_USER" });

Course.belongsTo(Professor, { foreignKey: "ID_TEACHER" });
Professor.hasMany(Course, { foreignKey: "ID_TEACHER" });

export default Course;