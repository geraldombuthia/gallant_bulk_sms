const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * @brief Stores transaction records of purchased credits
 * 
 */
const Credit = sequelize.define("Credits", {
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
        allowNull: false
    },
    paymentId: {
        type: DataTypes.INTEGER,
        references: {
            model: "Payments",
            key: "id"
        },
        allowNull: false
    },
    creditsValue:{ // Value in currency
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false,
    },
    creditUnit: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false
    },
    productType: { // SMS, Emails, Registration, e.t.c
        type: DataTypes.STRING(20),
        defaultValue: "sms",
        allowNull: false
    }

}, {
    sequelize,
    modelname: "Credit",
    tablename: "Credits",
    timestamps: true,
    updatedAt: "lastModified",
});

module.exports = Credit;