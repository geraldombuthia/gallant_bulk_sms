const AuthService = require("../service/auth.service");

class AuthController {
    static async register(req, res, next) {
        try {
            console.log("Request body: ", req.body);
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
            res.redirect("/auth/login"); // Redirect to the home page
        });
    }
}

module.exports = AuthController;
