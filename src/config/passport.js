const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { pool } = require("./postgres");

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
               const result = await pool.query(
                  "SELECT * FROM USERS WHERE email = $1",
                  [email]
               );

               if (result.rows.length === 0) {
                  return done(null, false, {
                     status: 404,
                     message: "No user with that email",
                     redirectUrl: "/user",
                  });
               }

               const user = result.rows[0];
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
      done(null, user.email, {
         status: 200,
         message: "Logged in serialized",
         redirectUrl: "/home",
      });
   });
   passport.deserializeUser(async (email, done) => {
      try {
         const result = await pool.query(
            "SELECT * FROM USERS WHERE email = $1",
            [email]
         );

         if (result.rows.length === 0) {
            return done(null, false, {
               status: 404,
               message: "No user with that email",
               redirectUrl: "/user",
            });
         }

         const user = result.rows[0];
         return done(null, user, {
            status: 404,
            message: "Logged in deserialised",
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
