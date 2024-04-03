const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const localStrategy = require("passport-local").Strategy;
require("dotenv").config();

const users = [
   {
      name: "aa",
      email: "a@a",
      password: "$2b$10$di1ITxB121VUr9FfJghrv.JucYsyWl7MkVTE.JpKHgfRLAw3rbr7W",
   },
   {
      name: "bb",
      email: "b@b",
      password: "$2b$10$YgNPt15so5Qk4Tq04/wB0u4uQowqGiJwmitseddvN26bbE6.ADgbK",
   },
];

const odb = require("./odb");
passport.use(
   new localStrategy({ usernameField: "email" }, async function (
      email,
      password,
      done
   ) {
      try {
         const user = users.find((user) => user.email === email);
         if (!user) {
            return done(null, false, { message: "No user with that email" });
         }

         const isPasswordMatch = await bcrypt.compare(password, user.password);
         if (!isPasswordMatch) {
            return done(null, false, { message: "Password incorrect" });
         }

         return done(null, user);
      } catch (error) {
         return done(error);
      }
   })
);
passport.serializeUser((user, done) => {
   done(null, user.email);
});
passport.deserializeUser((email, done) => {
   const user = users.find((user) => user.email === email);
   done(null, user);
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
   session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
   })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.delete("/logout", (req, res, next) => {
   req.logOut((err) => {
      if (err) {
         return next(err);
      }
      res.redirect("/");
   });
});
checkAuthenticated = (req, res, next) => {
   if (req.isAuthenticated()) {
      return next();
   }

   res.redirect("/user");
};
checkNotAuthenticated = (req, res, next) => {
   if (req.isAuthenticated()) {
      return res.redirect("/");
   }
   next();
};

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "..", "frontend", "html", "home.html"));
});
app.get("/user", (req, res) => {
   res.sendFile(path.join(__dirname, "..", "frontend", "html", "user.html"));
});
app.get("/dashboard", checkAuthenticated, (req, res) => {
   res.sendFile(
      path.join(__dirname, "..", "frontend", "html", "dashboard.html")
   );
});
app.get("/find", checkAuthenticated, (req, res) => {
   res.sendFile(path.join(__dirname, "..", "frontend", "html", "find.html"));
});
app.get("/create", checkAuthenticated, (req, res) => {
   res.sendFile(path.join(__dirname, "..", "frontend", "html", "create.html"));
});
app.get("/manage", checkAuthenticated, (req, res) => {
   res.sendFile(path.join(__dirname, "..", "frontend", "html", "manage.html"));
});
app.get("/history", checkAuthenticated, (req, res) => {
   res.sendFile(path.join(__dirname, "..", "frontend", "html", "history.html"));
});
app.get("/event", checkAuthenticated, (req, res) => {
   res.sendFile(path.join(__dirname, "..", "frontend", "html", "event.html"));
});

/*
app.get("/login", (req, res) => {
   res.sendFile(path.join(__dirname, "..", "frontend", "html", "login.html"));
});

app.post(
   "/login",
   passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/register",
      failureFlash: true,
   })
);
*/

app.get("/register", (req, res) => {
   res.sendFile(
      path.join(__dirname, "..", "frontend", "html", "register.html")
   );
});

app.post("/register", async (req, res) => {
   try {
      const existingUser = users.find((user) => user.email === req.body.email);
      if (existingUser) {
         return res.status(400).send("User with this email already exists.");
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      users.push({
         name: req.body.name,
         email: req.body.email,
         password: hashedPassword,
      });
      res.redirect("/user");
   } catch {
      res.redirect("/register");
   }
   console.log(users);
});

/*
app.post("/user/login", async (req, res) => {
   try {
      const { email, password } = req.body;
      const user = null;
      // const user = use_SQL_to_get_email(email);
      if (user == null) {
         return res.status(404).send({});
      }
      if (pass === "abc") {
         // if (await bcrypt.compare(use_SQL_to_get_pass(email), password)) {
         return res.status(200).send({});
      } else {
         return res.status(403).send({});
      }
   } catch (error) {
      console.error("Login error:", error);
      return res.status(500).send({});
   }
});
*/

app.post(
   "/user/login",
   passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/register",
      failureFlash: true,
   })
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
