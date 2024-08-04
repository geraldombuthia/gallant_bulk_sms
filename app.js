require('dotenv').config();

const express = require("express");
const path = require("path");
const session = require('express-session');
const passport = require('./src/config/passport.js');

const AuthRoutes = require("./src/routes/auth.routes.js")
const userAgentParser = require("./src/middleware/userAgentParser.js");
const extractIPAddress = require("./src/middleware/extractIPAddress.js");
const logDeviceAccess = require("./src/middleware/storeDeviceInfo.js");
const {testConnection} = require("./src/config/database.js");

const app = express();
const port = 3000;

testConnection();

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '/src/views'));

const skipFaviconMiddleware = (req, res, next) => {
    // Skips the favicon request from browsers
    // It is a stand in solution
    if (req.originalUrl === "/favicon.ico") {
        res.status(204).end();
    } else {
        next();
    }
};

app.use(session({
    secret: [process.env.SESSION_SECRET_PRIMARY, process.env.SESSION_SECRET_SECONDARY],
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: process.env.NODE_ENV === 'production', // only transmit over HTTPS
        httpOnly: true // prevents client-side JS from reading the cookie
    }

}))
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', AuthRoutes);

// app.use(skipFaviconMiddleware, userAgentParser, extractIPAddress, logDeviceAccess); // middleware 
app.route("/").get((req, res) => {

    // res.status(200).json({msg:"Welcome to Gallant Byte SMS"});
    res.render('index.ejs');
});

app.route("/about").get((req, res) => {
    res.status(200).json({msg:"About Gallant Byte SMS"});
});

app.listen(port, () => {
     
    console.log(`Listening on port: ${port}`);
});