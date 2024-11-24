const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");


/**
 * @brief Keeps track of whether a user is Registered
 */
const RegisterCredit = sequelize.define("RegisterCredits", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: "users",
            key: "id"
        },
        unique: true,
        allowNull: false
    },
    isRegistered: {
        type:DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelname: "RegisterCredit",
    tableName: "RegisterCredits",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "lastmodified"
});

module.exports = RegisterCredit;