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
      userType: "attendee",
      regNo: "11",
      phone: "11",
      password: "$2b$10$di1ITxB121VUr9FfJghrv.JucYsyWl7MkVTE.JpKHgfRLAw3rbr7W",
   },
   {
      name: "bb",
      email: "b@b",
      userType: "organiser",
      regNo: "22",
      phone: "22",
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

app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "ejs");

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

   res.redirect("/");
};
checkNotAuthenticated = (req, res, next) => {
   if (req.isAuthenticated()) {
      return res.redirect("/home");
   }
   next();
};

app.get("/", checkNotAuthenticated, (req, res) => {
   res.render("root", {});
});
app.get("/home", checkAuthenticated, (req, res) => {
   res.render("home", { user: req.user.userType });
});
app.get("/user", checkNotAuthenticated, (req, res) => {
   res.render("user", {});
});
app.get("/dashboard", checkAuthenticated, (req, res) => {
   res.render("dashboard", {
      user: req.user.userType,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      regNo: req.user.regNo,
   });
});
app.get("/find", checkAuthenticated, (req, res) => {
   res.render("find", { user: req.user.userType });
});
app.get("/create", checkAuthenticated, (req, res) => {
   res.render("create", { user: req.user.userType });
});
app.get("/manage", checkAuthenticated, (req, res) => {
   res.render("manage", { user: req.user.userType });
});
app.get("/history", checkAuthenticated, (req, res) => {
   res.render("history", { user: req.user.userType });
});
app.get("/event", checkAuthenticated, (req, res) => {
   res.render("event", { user: req.user.userType });
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

app.get("/register", (req, res) => {
   res.render("register");
});
*/

app.post("/user/signup", async (req, res) => {
   try {
      console.log(req.body);
      console.log(req.body.userType);
      const existingUser = users.find((user) => user.email === req.body.email);
      // const existingUser = use_SQL_to_check_for_exist_User(email);
      if (existingUser) {
         res.redirect("/user", { message: "Email already in use" });
      }
      if (req.body.password == req.body.confirmPassword) {
         res.redirect("/user", { message: "Password not matching" });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      users.push({
         name: req.body.name,
         email: req.body.email,
         userType: req.body.userType,
         regNo: req.body.regNo,
         phone: req.body.phone,
         password: hashedPassword,
      });
      // push data into attendee or organiser table
      res.redirect("/home", { message: "User registered successfully" });
   } catch {
      res.redirect("/user", { message: "Some error occured there" });
   }
   console.log(users);
});

/*
app.post("/user/login", async (req, res) => {
   try {
      const { email, password } = req.body;
      const mail = users.find((user) => user.email === req.body.email);
      // const mail = use_SQL_to_get_email(email);
      if (mail == null) {
         res.redirect("/user", { message: "Email not found" });
      }
      if (await bcrypt.compare(password, mail.password)) {
         // if (await bcrypt.compare(use_SQL_to_get_pass(email), password)) {
         res.redirect("/");
      } else {
         res.redirect("/user", { message: "Invalid email or password" });
      }
   } catch (error) {
      console.error("Login error:", error);
      res.redirect("/user", { message: "Some error occured" });
   }
});
*/

app.get("/test", async (req, res) => {
   res.status(200).render(odb.queryTable);
});

app.post(
   "/user/login",
   passport.authenticate("local", {
      successRedirect: "/home",
      failureRedirect: "/",
      failureFlash: true,
   })
);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
