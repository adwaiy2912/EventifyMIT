const bcrypt = require("bcrypt");
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

exports.signup = async (req, res) => {
   try {
      // const userCheck = users.find((user) => user.email === req.body.email);
      const userEmailCheck = await sqlCheckForExistUser(
         "email",
         req.body.email
      );
      const userIDCheck = await sqlCheckForExistUser("ID", req.body.regNo);

      if (userEmailCheck || userIDCheck) {
         console.log(userEmailCheck || userIDCheck);
         return res.redirect(400, "/user");
      }
      if (req.body.password !== req.body.confirmPassword) {
         console.log("user password not matching");
         return res.redirect(403, "/user");
      }
      await sqlCreateUser(req.body);

      console.log("user created");
      return res.redirect(201, "/home");
   } catch {
      console.log("error occured");
      return res.redirect(500, "/");
   }
};

exports.create = async (req, res) => {
   try {
      const eventID = generateUniqueString(10);
      const venueID = await getVenueID(req.body.venue);

      await sqlCreateEvent(req.body, eventID, venueID, req.user.organizer_id);

      console.log("event created");
      return res.redirect(201, "/home");
   } catch {
      console.log("error occured");
      return res.redirect(500, "/");
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
         console.log("payment failed");
         return res.redirect(400, "/home");
      }
      await sqlCreateRegistration(eventID, userID, paymentStatus);

      console.log("user registered");
      return res.redirect(200, redirectUrl);
   } catch {
      console.log("error occured");
      return res.redirect(500, "/home");
   }
};

exports.updateEvent = async (req, res) => {
   try {
      const venueID = await getVenueID(req.body.venue);
      const redirectUrl = req.get("referer") || "/home";

      await sqlUpdateEvent(req.body, venueID);

      console.log("event updated");
      return res.redirect(201, redirectUrl);
   } catch {
      console.log("error occured");
      return res.redirect(500, "/home");
   }
};

exports.updateProfile = async (req, res) => {
   try {
      const redirectUrl = req.get("referer") || "/home";

      await sqlUpdateProfile(req.body);

      console.log("profile updated");
      return res.redirect(200, redirectUrl);
   } catch {
      console.log("error occured");
      return res.redirect(500, "/home");
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
         console.log("old password incorrect");
         return res.redirect(403, "/home");
      }
      if (req.body.newPassword !== req.body.confirmNewPassword) {
         console.log("new password not matching");
         return res.redirect(403, "/home");
      }
      await sqlUpdatePassword(req.body);

      console.log("password updated");
      return res.redirect(200, redirectUrl);
   } catch {
      console.log("error occured");
      return res.redirect(500, "/home");
   }
};
