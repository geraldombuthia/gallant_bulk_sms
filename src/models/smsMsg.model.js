const { sequelize } = require("../config/database");
const { DataTypes, Models } = require("sequelize");


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
            model: "Users",
            key: 'id'
        },
    },
    senderId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        types:DataTypes.STRING,
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
    provideId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    providerResponse: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    cost: {
        type: DataTypes.DECIMAL(10, 2),
        allwNull: true
    }
}, {
    sequelize,
    modelName: 'SMS',
    tableName: 'SMSMsg',
    timestamps: true,
});

model.exports = SMS;