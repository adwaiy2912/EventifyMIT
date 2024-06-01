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

module.exports = router;
