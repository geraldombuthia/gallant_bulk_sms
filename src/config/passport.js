const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/users.js");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });

        console.log("User: ", user);
        if (!user) {
          console.log("Incorrect email");
          return done(null, false, { message: "Incorrect email." });

        }
        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
          console.log("Incorrect password");
          return done(null, false, { message: "Incorrect password" });
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