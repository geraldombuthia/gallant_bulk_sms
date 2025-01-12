const AuthService = require("../service/auth.service");

class AuthController {
    static async register(req, res, next) {
        try {
            const user = await AuthService.register(req.body);
            console.error("User registered: ", user);

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
            res.redirect(201, "/auth/login");
            AuthController.redirectMessage;
        } catch (error) {
            next(error);
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
