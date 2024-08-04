const AuthService = require("../service/auth.service");

class AuthController {
  static async register(req, res, next) {
    try {
      const user = await AuthService.register(req.body); // Requires a bit of validation and sanitization here
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res) {
    res.json({ user: req.user, message: "Logged in successfully" });
  }

  static async logout(req, res) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.json({message: 'Logged out successfully'});
    });
  }
}

module.exports = AuthController;
