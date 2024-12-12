const { sequelize } = require("../config/database");
const { DataTypes, Model } = require("sequelize");

class Email extends Model {}

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
            model: "users",
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
        type: DataTypes.TEXT, // Optional
        allowNull: true,
    },
    isHTML: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, 
    },
    recipient: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: JSON.stringify({
            to: [],
            cc: [],
            bcc: []
        }),
        // May need to remove this getter and setter function
        get() {
            // Parse JSON when retrieving
            return JSON.parse(this.getDataValue("recipient"));
        },
        set(value) {
            // Validate and set JSON
            this.setDataValue("recipient", JSON.stringify(value));
        }
    },
    sender: {   // Senders email
        type: DataTypes.STRING,
        allowNull: false
    },
    deliveryStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "pending"
    },
    providerId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    providerResponse: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    modelName: "Email",
    tableName: "Emails",
    timestamps: true
});

module.exports = Email;