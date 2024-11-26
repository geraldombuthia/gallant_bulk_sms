const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const SMSCredit = sequelize.define("SMSCredits", {
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
    creditBalance: {
        type:DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize,
    modelname: "SMSCredit",
    tableName: "SMSCredits",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "lastmodified"
});

module.exports = SMSCredit;