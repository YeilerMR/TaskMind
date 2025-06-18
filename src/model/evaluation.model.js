import { DataTypes } from "sequelize";
import dbConnection from "../database/dbConnection.js";
import Course from "./course.model.js";
import User from "./user.model.js";

const EvaluationType = dbConnection.define("EvaluationType", {
    ID_TYPE: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ID_COURSE: {
        type: DataTypes.INTEGER,
        references: {
            model: Course,
            key: "ID_COURSE"
        },
        allowNull: false
    },
    DSC_NAME: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    WEIGHT: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    DATE_EVALUATION: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    DSC_EVALUATION: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    ID_USER: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: "ID_USER"
        },
        allowNull: false
    }
},
    {
        timestamps: false,
        tableName: "tsim_evaluation_type"
    }
);

EvaluationType.belongsTo(Course, { foreignKey: 'ID_COURSE' });
Course.hasMany(EvaluationType, { foreignKey: 'ID_COURSE' });

EvaluationType.belongsTo(User, { foreignKey: 'ID_USER' });
User.hasMany(EvaluationType, { foreignKey: 'ID_USER' });

export default EvaluationType;