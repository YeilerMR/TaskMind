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
    },

},
    {
        timestamps: false,
        tableName: "tsim_student_evaluation"
    });

EvaluationType.belongsTo(Course, {
    foreignKey: 'ID_COURSE'
});
Course.hasMany(EvaluationType, {
    foreignKey: 'ID_COURSE'
});

EvaluationType.belongsTo(User, {
    foreignKey: 'ID_USER'
});
User.hasMany(EvaluationType, {
    foreignKey: 'ID_USER'
});

StudentEvaluation.belongsTo(EvaluationType, {
    foreignKey: 'ID_TYPE'
});
EvaluationType.hasMany(StudentEvaluation, {
    foreignKey: 'ID_TYPE'
});


export default { EvaluationType, StudentEvaluation };