const { check, validationResult } = require("express-validator");

const validateRegister = [
    check("name")
        .notEmpty()
        .withMessage("Please enter a valid name")
        .trim()
        .escape(),
    check("username", "Please enter a valid username")
        .notEmpty()
        .trim()
        .escape(),
    check("email", "Please enter a valid email").isEmail().normalizeEmail(),
    check("phone", "Please enter a valid phone number").isMobilePhone(),
    check("password")
        .isLength({ min: 8 })
        .withMessage("Password must be atleast 8 characters long")
        .matches("[0-9]")
        .withMessage("Password Must Contain a Number"),
];

const validateLogin = [
    check("email", "Please enter a valid email").isEmail().normalizeEmail(),
    check("password", "Please enter a valid password").isLength({ min: 8 }),
];

const validationHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validationHandler,
};
