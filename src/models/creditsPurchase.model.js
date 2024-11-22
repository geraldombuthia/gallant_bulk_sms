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
    payment_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "Payments",
            key: "id"
        },
        allowNull: false
    },
    credits_purchased:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    purchase_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    channel: {
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