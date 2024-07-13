const express = require("express");
const userAgentParser = require("./src/middleware/userAgentParser.js");
const extractIPAddress = require("./src/middleware/extractIPAddress.js");

const app = express();
const port = 3000;

app.use(userAgentParser, extractIPAddress); // middleware to extract browser information
app.route("/").get((req, res) => {
    // eslint-disable-next-line no-console
    console.log(req.userAgent?.os?.name);

    res.status(200).json({msg:"Welcome to Gallant Byte SMS"});
});

app.route("/about").get((req, res) => {
    res.status(200).json({msg:"About Gallant Byte SMS"});
});

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port: ${port}`);
});