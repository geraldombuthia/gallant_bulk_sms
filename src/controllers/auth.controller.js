const AuthService = require("../service/auth.service");
const { validationResult } = require("../utils/validate");

class AuthController {
    static async register(req, res, next) {
        try {
            console.log("Request body: ", req.body);
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
            }
            // Implement validation and sanitazition of data on the request body
            const user = await AuthService.register(req.body);
            console.log("User: ", user);
            res.redirect(201, "/auth/login");
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res) {
        res.redirect("/dashboard");
    }

    static async logout(req, res, next) {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.redirect("/login"); // Redirect to the home page
        });
    }
}

module.exports = AuthController;
