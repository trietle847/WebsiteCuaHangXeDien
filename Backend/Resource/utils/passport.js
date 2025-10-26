const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../models/user.model");
const CartModel = require("../models/cart.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/user/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({
          where: { email: profile.emails[0].value },
        });

        // console.log(profile);
        if (!user) {
          user = await UserModel.create({
            google_id: profile.id,
            username: profile.emails[0].value,
            email: profile.emails[0].value,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            login_type: "google",
          });

          const CartModel = require("../models/cart.model");
          await CartModel.create({ user_id: user.user_id });

        } else if (!user.google_id) {
          user.google_id = profile.id,
          user.login_type = "google",
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// BỎ serialize/deserialize (không cần với JWT)
// passport.serializeUser((user, done) => done(null, user));
// passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
