const AuthService = require("../service/auth.service");

class AuthController {
  static async register(req, res, next) {
    try {
        console.log("Request body: ", req.body);
        // Implement validation and sanitazition of data on the request body
      const user = await AuthService.register(req.body); // Requires a bit of validation and sanitization here
      res.status(201).redirect("/auth/login");
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res) {
    console.log(req.body);
    // res.json({ user: req.user, message: "Logged in successfully" });
    res.redirect("/dashboard");
  }

  static async logout(req, res) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.json({ message: "Logged out successfully" });
    });
  }
}

module.exports = AuthController;
