const { sequelize } = require("../config/database");
const { DataTypes, Models } = require("sequelize");

class Email extends Models {}

Email.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: "id"
        },
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    textBody: { // Optional if HTML provided
        type: DataTypes.TEXT,
        allowNull: true
    },
    htmlBody: { // Optional if Text provided
        types: DataTypes.TEXT, // Optional
        allowNull: true,
    },
    isHTML: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, 
    },
    recipient: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
            to: [],
            cc: [],
            bcc: []
        },
        get() {
            // Parse JSON when retrieving
            return this.getDataValue('recipients');
        },
        set(value) {
            // Validate and set JSON
            this.setDataValue('recipients', value);
        }
    },
    sender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deliveryStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    providerId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    providerResponse: {
        type: DataTypes.STRING,
        allowNUll: true,
    },
    sentAt: {
        type: DataTypes.DATE
    }, 
    trackingID: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    sequelize,
    modelName: 'Email',
    tableName: 'Emails',
    timestamps: true
});

module.exports = Email;