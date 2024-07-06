const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/login", userController.login);

router.post("/signup", userController.signup);

router.delete("/logout", userController.logout);

router.post("/verifyOTP", userController.verifyOTP);

router.post("/resendOTP", userController.resendOTP);

router.post("/create", userController.create);

router.post("/register", userController.register);

router.post("/update/event", userController.updateEvent);

router.post("/update/profile", userController.updateProfile);

router.post("/update/password", userController.updatePassword);

module.exports = router;
