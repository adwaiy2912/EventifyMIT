const bcrypt = require("bcrypt");
const passport = require("passport");
const {
   sqlCreateUser,
   sqlCreateEvent,
   sqlCreateRegistration,
} = require("../models/userCreateModels");
const { sqlGetPassword } = require("../models/userGetModels");
const {
   sqlUpdateEvent,
   sqlUpdateProfile,
   sqlUpdatePassword,
} = require("../models/userUpdateModels");
const { sqlCheckForExistUser } = require("../models/utilsModels");

const { generateUniqueString, getVenueID } = require("../utils/userUtils");

exports.login = (req, res, next) => {
   passport.authenticate("local-login", (err, user, info) => {
      const { status, message, redirectUrl } = info;
      if (err || !user) {
         return res.status(status).json({ message, redirectUrl });
      }
      req.logIn(user, (err) => {
         return res.status(status).json({ message, redirectUrl });
      });
   })(req, res, next);
};

exports.signup = async (req, res) => {
   try {
      // const userCheck = users.find((user) => user.email === req.body.email);
      const userEmailCheck = await sqlCheckForExistUser(
         "email",
         req.body.email
      );
      const userIDCheck = await sqlCheckForExistUser("ID", req.body.regNo);
      const userIdentifier = userEmailCheck || userIDCheck;

      if (userIdentifier) {
         return res.status(400).json({
            message: `${userIdentifier} aready in use`,
            redirectUrl: "/user",
         });
      }
      if (req.body.password !== req.body.confirmPassword) {
         return res
            .status(403)
            .json({ message: "Password not matching", redirectUrl: "/user" });
      }
      await sqlCreateUser(req.body);

      return res
         .status(201)
         .json({ message: "User created successfully", redirectUrl: "/home" });
   } catch {
      return res
         .status(500)
         .json({ message: "Failed to create user", redirectUrl: "/" });
   }
};

exports.logout = (req, res, next) => {
   req.logOut((err) => {
      if (err) {
         return next(err);
      }
      res.redirect("/");
   });
};

exports.create = async (req, res) => {
   try {
      const eventID = generateUniqueString(10);
      const venueID = await getVenueID(req.body.venue);

      await sqlCreateEvent(req.body, eventID, venueID, req.user.organizer_id);

      return res
         .status(201)
         .json({ message: "Event created successfully", redirectUrl: "/home" });
   } catch {
      return res
         .status(500)
         .json({ message: "Failed to create event", redirectUrl: "/home" });
   }
};

exports.register = async (req, res) => {
   try {
      let { eventID, userID, paymentStatus } = req.body;
      const redirectUrl = req.get("referer") || "/home";

      if (paymentStatus === "PENDING") {
         await paymentAPI(req.body);
      }
      if (paymentStatus === "FAILED") {
         return res
            .status(400)
            .json({ message: "Payment Failed", redirectUrl });
      }
      await sqlCreateRegistration(eventID, userID, paymentStatus);

      return res.status(200).json({
         message: "Registration successful",
         redirectUrl,
      });
   } catch {
      return res.status(500).json({
         message: "Failed to register to event",
         redirectUrl: "/home",
      });
   }
};

exports.updateEvent = async (req, res) => {
   try {
      const venueID = await getVenueID(req.body.venue);
      const redirectUrl = req.get("referer") || "/home";

      await sqlUpdateEvent(req.body, venueID);

      return res
         .status(200)
         .json({ message: "Event updated successfully", redirectUrl });
   } catch {
      return res.status(500).json({
         message: "Failed to update event",
         redirectUrl: "/home",
      });
   }
};

exports.updateProfile = async (req, res) => {
   try {
      const redirectUrl = req.get("referer") || "/home";

      await sqlUpdateProfile(req.body);

      return res
         .status(200)
         .json({ message: "Profile updated successfully", redirectUrl });
   } catch {
      return res.status(500).json({
         message: "Failed to update profile",
         redirectUrl: "/home",
      });
   }
};

exports.updatePassword = async (req, res) => {
   try {
      const redirectUrl = req.get("referer") || "/home";
      const isPasswordMatch = await bcrypt.compare(
         req.body.oldPassword,
         await sqlGetPassword(req.body.id, req.body.user)
      );

      if (!isPasswordMatch) {
         return res.status(403).json({
            message: "Old password is incorrect",
            redirectUrl,
         });
      }
      if (req.body.newPassword !== req.body.confirmNewPassword) {
         return res.status(403).json({
            message: "New password not matching",
            redirectUrl,
         });
      }
      await sqlUpdatePassword(req.body);

      return res.status(200).json({
         message: "Password updated successfully",
         redirectUrl,
      });
   } catch {
      return res.status(500).json({
         message: "Failed to update password",
         redirectUrl,
      });
   }
};
