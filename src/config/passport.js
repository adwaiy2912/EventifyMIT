const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { pool } = require("./postgres");
const User = require("../models/user");

module.exports = function (passport) {
   passport.use(
      "local-login",
      new localStrategy(
         {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
         },
         async (req, email, password, done) => {
            try {
               const user = await User.findOne({
                  where: {
                     email,
                  },
               });

               if (!user) {
                  return done(null, false, {
                     status: 404,
                     message: "No user with that email",
                     redirectUrl: "/user",
                  });
               }

               const isPasswordMatch = await bcrypt.compare(
                  password,
                  user.password
               );
               if (!isPasswordMatch) {
                  return done(null, false, {
                     status: 403,
                     message: "Password incorrect",
                     redirectUrl: "/user",
                  });
               }

               return done(null, user, {
                  status: 200,
                  message: "Login successful",
                  redirectUrl: "/home",
               });
            } catch (error) {
               return done(error, false, {
                  status: 500,
                  message: "Failed to login",
                  redirectUrl: "/",
               });
            }
         }
      )
   );
   passport.serializeUser((user, done) => {
      done(null, user.email);
   });
   passport.deserializeUser(async (email, done) => {
      try {
         const user = await User.findOne({
            email,
         });

         if (!user) {
            return done(null, false, {
               status: 404,
               message: "No user with that email",
               redirectUrl: "/user",
            });
         }

         return done(null, user);
      } catch (error) {
         return done(error, false);
      }
   });
};
