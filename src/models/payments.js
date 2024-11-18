const {Model, DataTypes} = require("sequelize");
const { Sequelize } = require("../config/database");
const bcrypt = require("bcrypt");

const Payments =  Sequelize.define("Payments",{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        required: true
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false, 
    },
    transaction_code: { // Transaction code
        type: DataTypes.STRING(50),
        allowNull: false
    },
    payment_method: { // Mpesa? Airtel? paypal? e.t.c
        type: DataTypes.STRING(50),
        allowNull: false,
        enum: ['mpesa', 'airtelmoney', 'paypal', 'google_pay'],
        default_value: 'mpesa'
    }, 
    transaction_status: { // pending, completed, failed, refunded
        type: DataTypes.STRING(50),
        enum: ['pending', 'completed', 'failed', 'refunded'],
        defaultValue: 'pending',
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING(50),
        enum: ['USD', 'KE'],
        defaultValue: 'KE'
    },
    merchant_request_id: {
        type: DataTypes.STRING(50)
    },
    checkoutRequestID: {
        type: DataTypes.STRING(50),
    }, 
    ResponseCode: {
        type: DataTypes.STRING(10),
        enum: ['0', '1032']
    },
    ResponseDesctiption: {
        type: DataTypes.STRING(50);
    }

}, {
    sequelize, 
    modelname: 'payment',
    tablename: 'Payments',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "lastmodified",
});

module.exports = Payments;