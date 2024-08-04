const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true 
    },
    name: {
        type: DataTypes.STRING(50),
    },
    username: {
        type: DataTypes. STRING(20)
    },
    email: {
        type: DataTypes.STRING(30)
    },
    phone: {
        type: DataTypes.STRING(20),
    },
    password: {
        type: DataTypes.STRING(50),
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: true, // Disable Sequelize's automatic timestamp handling
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = User;