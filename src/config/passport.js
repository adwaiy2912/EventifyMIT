const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("../models/index");

module.exports = (passport) => {
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
      done(null, user.email, {
         status: 200,
         message: "Logged in serialized",
         redirectUrl: "/home",
      });
   });
   passport.deserializeUser(async (email, done) => {
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

         return done(null, user, {
            status: 404,
            message: "Logged in deserialized",
            redirectUrl: "/home",
         });
      } catch (error) {
         return done(error, false, {
            status: 500,
            message: "Failed to deserialize user",
            redirectUrl: "/",
         });
      }
   });
};
