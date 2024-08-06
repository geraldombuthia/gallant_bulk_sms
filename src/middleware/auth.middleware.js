const passport = require("../config/passport");

/**
 * Implements an authentication mechanism using JWT.
 * @module authenticateJWT
 * @module isAuthenticated
 */
const authenticateJWT = passport.authenticate("jwt", {session: false});

/**
 * Implements an authentication mechanism for session based authentication using passport.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns next middleware or error on the response
 */
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({message: "Unauthorized"});
};

module.exports = {
    authenticateJWT,
    isAuthenticated
};