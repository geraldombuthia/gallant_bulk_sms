const AuthService = require("../service/auth.service");
const { sequelize } = require("../config/database");
const { UniqueConstraintError, ValidationError } = sequelize.Sequelize;

class AuthController {
    static async register(req, res) {
        try {
            const user = await AuthService.register(req.body);
            console.error("User registered: ", user);

            if (!user) {
                res.locals.message = "Registration error.";
                res.redirect(303, "/auth/register");
            }

            // if (req.accepts('json')) {
            //     // If it's an API request, return JSON
            //     return res.status(201).json({
            //         message: 'Registration successful. Please login',
            //         user: user
            //     });
            // } else {
            //     // For SSR, redirect to the login page with a success message
            //     res.locals.message = 'Registration successful. Please login.'
            //     return res.redirect(201, "/auth/login");
            // }
            res.locals.message = "Registration succesful. Please login";
            res.redirect(303, "/auth/login");
            // AuthController.redirectMessage;
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                res.locals.error = `${error.errors[0].path} is already in use`;
                return res.redirect(303, "/auth/register");
            }

            if (error instanceof ValidationError) {
                // For validation errors
                res.locals.error = error.errors[0].message;
                return res.redirect(303, "/auth/register");
            }
            // For unexpected errors
            console.error("Registration error: ", error);
            res.locals.error = "An unexpected error occurred";
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
