const { check, validationResult } = require("express-validator");

const validateRegister = [
    check("name", "Please enter a valid name").not.isEmpty().trim().escape(),
    check("username", "Please enter a valid username").not.isEmpty().trim().escape(),
    check("email", "Please enter a valid email").isEmail().normalizeEmail(),
    check("phone", "Please enter a valid phone number").isMobilePhone(),
    check("password", "Please enter a valid password")
        .isLength({ min: 8 })
        .withMessage("Password must be atleast 8 characters long")
        .matches("[0-9]")
        .withMessage("Password Must Contain a Number"),
];

const validateLogin = [
    check("email", "Please enter a valid email").isEmail().normalizeEmail(),
    check("password", "Please enter a valid password").isLength({ min: 8 }),
];

module.exports = {
    validateRegister,
    validateLogin,
    validationResult,
};