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
        // .matches(/[A-Z]/)
        // .withMessage("Password must include an uppercase letter")
        // .matches(/[a-z]/)
        // .withMessage("Password must include a lowercase letter")
        // .matches(/[0-9]/)
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

const validateSMS = [
    check("message", "Please enter a valid message")
        .exists({checkFalsy: true})
        .trim()
        .notEmpty()
        .escape()
        .isString()
        .withMessage("Message must be a string"),
    check("phoneNumber", "Please enter a valid phone Number")
        .exists({checkFalsy: true})
        .trim()
        .notEmpty()
        .escape()
        .isMobilePhone()
        .withMessage("Phonenumber must be a string"),
];

const validateEmailInput = [
    body("subject", "Please enter a valid subject")
        .trim()
        .notEmpty()
        .escape()
        .isString()
        .withMessage("Subject must be a string"),
    body("recipient", "Please enter a valid recipient")
        .trim()
        .notEmpty()
        .escape()
        .isEmail()
        .withMessage("Recipient must be a string"),
    body("sender", "Please enter a valid sender")
        .trim()
        .notEmpty()
        .escape()
        .isEmail()
        .withMessage("Sender must be a string"),
    body("textBody", "Please enter a valid text body")
        .trim()
        .notEmpty()
        .escape()
        .isString()
        .withMessage("Text body must be a string"),
    body("htmlBody", "Please enter a valid html body")
        .trim()
        .notEmpty()
        .escape()
        .isString()
        .withMessage("Html body must be a string"),
];
const validationHandler = (req, res, next) => {
    const errors = validationResult(req);
    const data = matchedData(req);
    console.log("Req body is empty",req.body);
    if (!errors.isEmpty()) {
        console.log("Validatuon errors:", errors.array());
      
        // For web requests, store the first error in res.locals
        const firstError = errors.array()[0];
        res.locals.error = firstError.msg;

        if (req.originalUrl.includes("login")) {
            req.flash("error", res.locals.error);
            return res.redirect("/auth/login");
        }

        if (req.originalUrl.includes("register")) {
            req.flash("error", res.locals.error);
            return res.redirect("/auth/register");
        }
        
    }
    
    // Store the validated data in res.locals for use in next middleware
    res.locals.validData = data;
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validatePayment,
    validateSMS,
    validateEmailInput,
    validationHandler,
};
