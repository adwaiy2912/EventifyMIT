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
               // const user = users.find((user) => user.email === email);
               const result1 = await pool.query(
                  "SELECT * FROM ORGANIZERS WHERE email = $1",
                  [email]
               );
               const result2 = await pool.query(
                  "SELECT * FROM ATTENDEES WHERE email = $1",
                  [email]
               );

               if (result1.rows.length === 0 && result2.rows.length === 0) {
                  return done(null, false, {
                     message: "No user with that email",
                  });
               }

               const user = result1.rows[0] || result2.rows[0];
               const isPasswordMatch = await bcrypt.compare(
                  password,
                  user.password
               );
               // const isPasswordMatch = password === user[3];
               if (!isPasswordMatch) {
                  return done(null, false, { message: "Password incorrect" });
               }

               return done(null, user);
            } catch (error) {
               return done(error);
            }
         }
      )
   );
   passport.serializeUser((user, done) => {
      done(null, user.email);
   });
   passport.deserializeUser(async (email, done) => {
      // const user = users.find((user) => user.email === email);
      try {
         const result1 = await pool.query(
            "SELECT * FROM ORGANIZERS WHERE email = $1",
            [email]
         );
         const result2 = await pool.query(
            "SELECT * FROM ATTENDEES WHERE email = $1",
            [email]
         );

         if (result1.rows.length === 0 && result2.rows.length === 0) {
            return done(null, false, {
               message: "No user with that email",
            });
         }

         const user = result1.rows[0] || result2.rows[0];
         return done(null, user);
      } catch (error) {
         return done(error);
      }
   });
};
