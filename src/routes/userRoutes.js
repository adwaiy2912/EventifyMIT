const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController");

router.post("/signup", userController.signup);

router.post(
   "/login",
   passport.authenticate("local-login", {
      successRedirect: "/home",
      failureRedirect: "/",
      failureFlash: true,
   })
);

router.post("/create", userController.create);

router.post("/register", userController.register);

router.delete("/logout", (req, res, next) => {
   req.logOut((err) => {
      if (err) {
         return next(err);
      }
      res.redirect("/");
   });
});

module.exports = router;
