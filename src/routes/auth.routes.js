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
    res.render("register", { user: req.user });
});
router.post(
    "/register",
    validateRegister,
    validationHandler,
    AuthController.register
);
router.get("/login", (req, res) => {
    res.render("login");
});
router.post(
    "/login",
    // validateLogin,
    // validationHandler,
    passport.authenticate("local"),
    AuthController.login
);
router.get("/logout", AuthController.logout, (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/"); // Redirect to the home page
    });
});

module.exports = router;
