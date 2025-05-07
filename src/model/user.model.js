import dbConnection from "../database/dbConnection.js";   
import DataTypes from 'sequelize';

const User = dbConnection.define("user", {
    ID_USER: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    DSC_FIRST_NAME: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    DSC_LAST_NAME_ONE: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    DSC_IDENTIFICATION:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    DSC_EMAIL: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    DSC_PASSWORD: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    DATE_CREATED: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    STATUS: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    DSC_CAREER: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
}, {
    tableName: "tsit_user", 
    timestamps: false, 
});

export default User;
