import { DataTypes } from "sequelize";
import dbConnection from "../database/dbConnection.js";
import EvaluationType from "./evaluation.model.js";

const StudentEvaluation = dbConnection.define("StudentEvaluation", {
    ID_EVALUATION: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ID_TYPE: {
        type: DataTypes.INTEGER,
        references: {
            model: EvaluationType,
            key: "ID_TYPE"
        },
        allowNull: false
    },
    SCORE_OBTAINED: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    DSC_COMMENT: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: "tsit_student_evaluation"
});

StudentEvaluation.belongsTo(EvaluationType, { foreignKey: 'ID_TYPE' });
EvaluationType.hasMany(StudentEvaluation, { foreignKey: 'ID_TYPE' });

export default StudentEvaluation;