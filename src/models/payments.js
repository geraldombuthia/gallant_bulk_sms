const {DataTypes} = require("sequelize");
const { sequelize } = require("../config/database");

const Payment =  sequelize.define("Payment",{
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
        required: true
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false, 
    },
    transaction_code: { // Transaction code// Receipt Number
        type: DataTypes.STRING(50),
    },
    payment_method: { // Mpesa? Airtel? paypal? e.t.c
        type: DataTypes.STRING(50),
        allowNull: false,
        enum: ["mpesa", "airtelmoney", "paypal", "google_pay"],
        default_value: "mpesa"
    }, 
    transaction_status: { // pending, success, failed, refunded
        type: DataTypes.STRING(50),
        enum: ["pending", "success", "failed", "refunded"],
        defaultValue: "pending",
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING(50),
        enum: ["USD", "KE"],
        defaultValue: "KE"
    },
    merchantRequestID: {
        type: DataTypes.STRING(50)
    },
    checkoutRequestID: {
        type: DataTypes.STRING(50),
    }, 
    responseCode: {
        type: DataTypes.STRING(10),
        enum: ["0", "1032"],
        defaultValue: "0"
    },
    responseDescription: {
        type: DataTypes.STRING(50),
    },
    transactionDate: {
        type: DataTypes.STRING(20)
    },
    phone: {
        type: DataTypes.STRING(15),
    },
    purchaseType: {
        type: DataTypes.STRING(20),
        enum: ["register", "purchase"],
        defaultValue: "purchase"
    }

}, {
    sequelize, 
    modelname: "Payment",
    tablename: "Payments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "lastmodified",
});

module.exports = Payment;