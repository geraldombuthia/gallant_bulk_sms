const { sequelize } = require("../config/database");
const { DataTypes, Model } = require("sequelize");


class SMS extends Model {

}
SMS.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: 'id'
        },
    },
    senderId: {         // shortcode used to send
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type:DataTypes.STRING,
        allowNull:  false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    deliveryStatus: {
        type: DataTypes.STRING(20),
        defaultValue: 'pending',
    },
    retryAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    providerId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    providerResponse: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'SMS',
    tableName: 'SMSMsg',
    timestamps: true,
});

module.exports = SMS;