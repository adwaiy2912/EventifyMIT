/*import * as express from "express";
import * as path from "path";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as passport from "passport";
import * as flash from "express-flash";
import * as session from "express-session";
import * as methodOverride from "method-override";
import pkg from "passport-local";
//const { localStrategy } = pkg.Strategy;
//var localStrategy   = require('passport-local').Strategy
var localStrategy = import("passport-local");

import { config } from "dotenv";
import { queryTable } from "./odb.js";
config();*/

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
const odb = require("./odb");



const users = [
   {
      name: "aa",
      email: "a@a",
      userType: "attendee",
      password: "$2b$10$di1ITxB121VUr9FfJghrv.JucYsyWl7MkVTE.JpKHgfRLAw3rbr7W",
   },
   {
      name: "bb",
      email: "b@b",
      userType: "organiser",
      password: "$2b$10$YgNPt15so5Qk4Tq04/wB0u4uQowqGiJwmitseddvN26bbE6.ADgbK",
   },
];

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

   res.redirect("/user");
};
checkNotAuthenticated = (req, res, next) => {
   if (req.isAuthenticated()) {
      return res.redirect("/");
   }
   next();
};

app.get("/", (req, res) => {
   res.render("home", {
      isAuth: req.isAuthenticated(),
      user: req.body.userType,
   });
});
app.get("/user", checkNotAuthenticated, (req, res) => {
   res.render("user", { user: req.body.userType });
});
app.get("/dashboard", checkAuthenticated, (req, res) => {
   res.render("dashboard", { user: req.body.userType });
});
app.get("/find", checkAuthenticated, (req, res) => {
   res.render("find", { user: req.body.userType });
});
app.get("/create", checkAuthenticated, (req, res) => {
   res.render("create", { user: req.body.userType });
});
app.get("/manage", checkAuthenticated, (req, res) => {
   res.render("manage", { user: req.body.userType });
});
app.get("/history", checkAuthenticated, (req, res) => {
   res.render("history", { user: req.body.userType });
});
app.get("/event", checkAuthenticated, async (req, res) => {
   
   res.render("event", { user: req.body.userType });
});

app.get("/adw", checkAuthenticated, async (req, res) => {
   try {
      const result = await odb.queryTable();
      console.log(res.json(result));
  } catch (err) {
      console.error("Error querying table:", err);
      res.status(500).json({ error: "Error querying table" });
  }
});




app.post("/user/signup", async (req, res) => {
   try {
      console.log(req.body);
      console.log(req.body.userType);
      const existingUser = users.find((user) => user.email === req.body.email);
      // const existingUser = use_SQL_to_check_for_exist_User(email);
      if (existingUser) {
         res.redirect("/user", { message: "Email already in use" });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      users.push({
         name: req.body.name,
         email: req.body.email,
         userType: req.body.userType,
         password: hashedPassword,
      });
      // push data into attendee or organiser table
      res.redirect("/", { message: "User registered successfully" });
   } catch {
      res.redirect("/user", { message: "Some error occured" });
   }
   console.log(users);
});

app.post(
   "/user/login",
   passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/user",
      failureFlash: true,
   })
);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
