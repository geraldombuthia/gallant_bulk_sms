const {
    parsePhoneNumberWithError,
    ParseError
} = require("libphonenumber-js");
const AuthService = require("../service/auth.service");
const { sequelize } = require("../config/database");
const { UniqueConstraintError, ValidationError } = sequelize.Sequelize;

class AuthController {
    static async register(req, res) {
        try {
            const validateNumber = parsePhoneNumberWithError(String(req.body.phone), {
                defaultCountry: "KE"
            });
            
            if (!validateNumber.isValid()) {
                throw new ParseError("Invalid phone number format");
            }
            const formatNumber = validateNumber.formatInternational()
                .replace(/^(\+)/, "")
                .replace(/\s+/g, "");

            req.body.phone = formatNumber;

            const user = await AuthService.register(req.body);
            console.error("User registered: ", user);

            if (!user) {
                req.flash("error", "Registration failed");
                res.redirect(303, "/auth/register");
            }
            res.locals.message = "Registration succesful. Please login";
            req.flash("success", "Registration successful!Please login");
            res.redirect(303, "/auth/login");
            // AuthController.redirectMessage;
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                req.flash("error", `${error.errors[0].path} is already in use`);
                console.log("Error of unique nature", error);
                return res.redirect(303, "/auth/register");
            }

            if (error instanceof ValidationError) {
                // For validation errors
                req.flash("error", `${error.errors[0].message}`);
                console.log("ValidationError", error);
                return res.redirect(303, "/auth/register");
            }
            // For unexpected errors
            console.error("Registration error: ", error);
            req.flash("error", `Registration Error: ${error.message}`);
            return res.redirect(303, "/auth/register");
        }
    }

    static async login(req, res) {
        if (req.user) {
            return res.redirect("/dashboard");
        } else {
            return res.redirect("/auth/login");
        }       
    }

    static async logout(req, res, next) {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
 
            res.redirect("/auth/login"); // Redirect to the home page
        });
    }

    static redirectMessage(req, res, path, statusCode, message) {
        if (req.accepts("json")) {
            return res.status(statusCode).json({
                message
            });
        } else {
            res.locals.message = message; // Set message for SSR (flash messaging)
            return res.status(statusCode).redirect(path);
        }
    }
}

module.exports = AuthController;
