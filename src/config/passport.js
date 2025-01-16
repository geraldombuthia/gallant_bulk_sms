const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/users.js");

passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ where: { email } });

                if (!user) {
                    return done(null, false, { message: "Incorrect email or password" });

                }
                const isMatch = await user.validatePassword(password);
                if (!isMatch) {
                    return done(null, false, { message: "Incorrect email or password" });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;