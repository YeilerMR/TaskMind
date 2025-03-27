import { DataTypes } from "sequelize";
import dbConnection from "../database/dbConnection.js";
import Professor from "./professorModel.js";

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
        STATUS: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        }
    },
    {
        timestamps: false,
        tableName: "tsim_course",
        schema: "dbo",
    }
);

Course.belongsTo(Professor, { foreignKey: "ID_TEACHER" });
Professor.hasMany(Course, { foreignKey: "ID_TEACHER" });

export default Course;