const express = require("express");
const passport = require("../config/passport");
const AuthController = require("../controllers/auth.controller");
const {
    validateRegister,
    validateLogin,
    validationHandler,
} = require("../utils/validate");

const router = express.Router();

router.get("/register", (req, res) => {
    res.render("register", {
        user: req.user,
        messages: req.flash(),
        layout: false,
    });
});
router.post(
    "/register",
    validateRegister,
    validationHandler,
    AuthController.register
);
router.get("/login", (req, res) => {
    res.render("login", { messages: req.flash(), layout: false });
});

router.post(
    "/login",
    validateLogin,
    validationHandler,
    (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                // Handle unexpected errors
                return next(err);
            }
            if (!user) {
                // Handle authentication failure (e.g. invalid credentials)
                req.flash("error", info.message || "Invalid credentials");
                console.log("Experienced an error");
                return res.redirect("/auth/login"); // stop execution here
            }
            // Log the user in
            req.logIn(user, (err) => {
                if (err) {
                    // Handle login errors
                    return next(err);
                }
                // Explicitly save the session before redirecting
                req.session.save((saveErr) => {
                    if (saveErr) {
                        return next(saveErr);
                    }

                    console.log("Session saved, redirecting to dashboard");
                    return res.redirect("/dashboard");
                });
            });
        })(req, res, next); // Pass `req`, `res`, `next` to `passport.authenticate`
    }
    // AuthController.login
);
router.get("/logout", AuthController.logout);

router.get("/ratelimit", (req, res) => {
    res.render("tooManyAttempts.ejs", { layout: false });
});

module.exports = router;
