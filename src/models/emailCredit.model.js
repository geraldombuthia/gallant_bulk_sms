const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * @brief Keeps track of number of Emails to send
 */
const EmailCredit = sequelize.define("EmailCredits", {
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
    },
    price_per_unit: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: false,
        defaultValue: 0.0000
    }
}, {
    sequelize,
    modelName: "EmailCredit",
    tableName: "EmailCredits",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "lastmodified"
});

module.exports = EmailCredit;