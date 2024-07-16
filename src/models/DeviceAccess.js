const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const DeviceAccess = sequelize.define("DeviceAccess", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    access_time: {
        type: DataTypes.DATE,
        defaultValues: DataTypes.NOW
    },
    ip_address: {
        type: DataTypes.STRING(20)
    },
    browser_name: {
        type: DataTypes.STRING(20)
    },
    browser_version: {
        type: DataTypes.STRING(20)
    },
    os_name: {
        type: DataTypes.STRING(20)
    },
    os_version: {
        type: DataTypes.STRING(20)
    },
    device_vendor: {
        type: DataTypes.STRING(20)
    },
    device_model: {
        type: DataTypes.STRING(2)
    },
    device_type: {
        type: DataTypes.STRING(20)
    },
    cpu_arch: {
        type: DataTypes.STRING(20)
    },
    screen_resolution: {
        type: DataTypes.STRING(20)
    },
    language: {
        type: DataTypes.STRING(10)
    }

}, {
    tableName: "device_access",
    timestamps: false
});

module.exports = DeviceAccess;