require("dotenv").config();

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST, // 'gallantbulkdb' for use with docker,
        port: 3306,
        dialect: process.env.DB_DIALECT,

        logging: (msg) => console.log("Sequelize Log:", msg),
    }
);

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

// Sync models with the database
const syncDatabase = async () => {
    try {
        // Sync all models
        await sequelize.sync({ force: false, alter: false }); 
        // force: false ensures that it doesn't drop the tables
        // alter: false ensures that it doesn't alter the tables
        console.log("Database synced successfully");
    } catch (error) {
        console.error("Error syncing the database:", error);
    }
};

module.exports = { sequelize, testConnection, syncDatabase };
