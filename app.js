require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const morgan = require("morgan");
const EventEmitter = require("events");

const passport = require("./src/config/passport.js");

const AuthRoutes = require("./src/routes/auth.routes.js");
const PayRoutes = require("./src/routes/payment.routes.js");
const CreditRoutes = require("./src/routes/credit.routes.js");
const MessageRoutes = require("./src/routes/message.routes.js");

// const userAgentParser = require("./src/middleware/userAgentParser.js");
// const extractIPAddress = require("./src/middleware/extractIPAddress.js");
// const logDeviceAccess = require("./src/middleware/storeDeviceInfo.js");
const {testConnection} = require("./src/config/database.js");
const {isAuthenticated} = require("./src/middleware/auth.middleware.js");

const app = express();
const port = 3000;
EventEmitter.defaultMaxListeners = 20;
testConnection();

app.timeout = 10000; // 10 seconds timeout
app.use(morgan("dev", { immediate: false}));
// app.use(morgan('combined', { immediate: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "/src/views"));

// const skipFaviconMiddleware = (req, res, next) => {
//     // Skips the favicon request from browsers
//     // It is a stand in solution
//     if (req.originalUrl === "/favicon.ico") {
//         res.status(204).end();
//     } else {
//         next();
//     }
// };

app.use(session({
    secret: [process.env.SESSION_SECRET_PRIMARY, process.env.SESSION_SECRET_SECONDARY],
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: process.env.NODE_ENV === "production", // only transmit over HTTPS
        httpOnly: true // prevents client-side JS from reading the cookie
    }

}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash()); // Enable flash messages
app.use((req, res, next) => {
    res.locals.messages = req.flash(); // Makes flash available in views
    next();
});
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use("/auth", AuthRoutes);
app.use("/pay", PayRoutes);
app.use("/credit", CreditRoutes);
app.use("/send", MessageRoutes);

// app.use(skipFaviconMiddleware, userAgentParser, extractIPAddress, logDeviceAccess);
app.route("/").get((req, res) => {

    res.render("index.ejs");
});

app.route("/about").get((req, res) => {
    res.status(200).json({msg:"About Gallant Byte SMS"});
});

app.route("/dashboard").get(isAuthenticated, (req, res) => {
    res.render("dashboard.ejs", {user: req.user});
});

app.listen(port, () => {
     
    console.log(`Listening on port: ${port}`);
});