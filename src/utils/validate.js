const { check, body, validationResult, matchedData } = require("express-validator");

const validateRegister = [
    check("name")
        .trim()
        .notEmpty()
        .withMessage("Please enter a valid name")
        .escape(),
    check("username", "Please enter a valid username")
        .trim()
        .notEmpty()
        .trim()
        .escape(),
    check("email", "Please enter a valid email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .escape(),
    check("phone", "Please enter a valid phone number")
        .trim()
        .isMobilePhone()
        .escape(),
    check("password")
        .isLength({ min: 8 })
        .notEmpty()
        .withMessage("Password must be atleast 8 characters long")
        .matches("[0-9]")
        .withMessage("Password Must Contain a Number"),
];

const validateLogin = [
    check("email", "Please enter a valid email").isEmail().normalizeEmail(),
    check("password", "Please enter a valid password")
        .isLength({ min: 8 })
        .withMessage("Password must be atleast 8 characters long")
        .matches(/[A-Z]/)
        .withMessage("Password must include an uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must include a lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must include a number"),
];

const validatePayment = [
    body("phoneNumber", "Please enter a valid phone Number as a string")
        .trim()
        .notEmpty()
        .escape()
        .isString()
        .withMessage("Phonenumber must be a string"),
    body("amount", "Please enter amount as a number")
        .trim()
        .notEmpty()
        .escape()
        .isInt({ min: 1 })
        .withMessage("Amount must be an Integer"),
    body("provider", "Please enter the provider as a string")
        .trim()
        .notEmpty()
        .escape()
        .isString()
        .withMessage("Enter string of supported provider"),
    body("currency", "Please enter a valid currency symbol as a string")
        .trim()
        .notEmpty()
        .escape()
        .isString()
        .withMessage("Currency symbol must be a string"),
    body("purchaseType", "Please enter the purchase type as a string")
        .trim()
        .notEmpty()
        .escape()
        .isString()
        .withMessage("Purchase Type must be a supported string"),
];

const validationHandler = (req, res, next) => {
    const errors = validationResult(req);
    const data = matchedData(req);

    if (!errors.isEmpty()) {
        console.log(data);
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validatePayment,
    validationHandler,
};
