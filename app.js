const express = require("express");
const userAgentParser = require("./src/middleware/userAgentParser.js");
const extractIPAddress = require("./src/middleware/extractIPAddress.js");
const logDeviceAccess = require("./src/middleware/storeDeviceInfo.js");
const {testConnection} = require("./src/config/database.js");
const app = express();
const port = 3000;

testConnection();

const skipFaviconMiddleware = (req, res, next) => {
    // Skips the favicon request from browsers
    // It is a stand in solution
    if (req.originalUrl === "/favicon.ico") {
        res.status(204).end();
    } else {
        next();
    }
};

app.use(skipFaviconMiddleware, userAgentParser, extractIPAddress, logDeviceAccess); // middleware 
app.route("/").get((req, res) => {

    res.status(200).json({msg:"Welcome to Gallant Byte SMS"});
});

app.route("/about").get((req, res) => {
    res.status(200).json({msg:"About Gallant Byte SMS"});
});

app.listen(port, () => {
     
    console.log(`Listening on port: ${port}`);
});