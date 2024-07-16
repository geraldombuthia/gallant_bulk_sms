const {Sequelize} = require("sequelize");

const sequelize = new Sequelize("gallantbulksms", "myuser", "new_password69", {
    host:"localhost",
    dialect: "mysql",
     
    logging: (msg) => console.log("Sequelize Log:", msg)
});

// Test the connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        // es-lint-disable-next-line no-console
        console.log("Connection Established Successfully");
    } catch (error) {
        // es-lint-disable-next-line no-console
        console.error("Unable to connect to the database:", error);
    }
}

module.exports = {sequelize, testConnection};