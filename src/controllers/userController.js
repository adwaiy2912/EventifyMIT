const bcrypt = require("bcrypt");
const passport = require("passport");
const {
   sqlCreateUser,
   sqlCreateEvent,
   sqlCreateRegistration,
} = require("../models/userCreateModels");
const { sqlGetOTP, sqlGetPassword } = require("../models/userGetModels");
const {
   sqlUpdateVerifiedStatus,
   sqlUpdateEvent,
   sqlUpdateProfile,
   sqlUpdatePassword,
} = require("../models/userUpdateModels");
const { sqlCheckForExistUser } = require("../models/utilsModels");

const {
   loginValidator,
   signupValidator,
   createValidator,
} = require("../utils/formValidator");
const { USERFIELD, VERIFIEDSTATUS } = require("../utils/enumObj");
const { generateUniqueString, getVenueID } = require("../utils/userUtils");

const { sendEmailOTP, sendPhoneOTP } = require("../utils/sendOTP");

exports.login = (req, res, next) => {
   const notValid = loginValidator(req.body);
   if (notValid) {
      return res.status(400).json({ message: notValid, redirectUrl: "/user" });
   }

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
      const notValid = signupValidator(req.body);
      if (notValid) {
         return res
            .status(400)
            .json({ message: notValid, redirectUrl: "/user" });
      }

      const userEmailCheck = await sqlCheckForExistUser(
         USERFIELD.EMAIL,
         req.body.email
      );
      const userIDCheck = await sqlCheckForExistUser(
         USERFIELD.ID,
         req.body.regNo
      );
      const userIdentifier = userEmailCheck || userIDCheck;

      if (userIdentifier) {
         return res.status(400).json({
            message: `${userIdentifier} aready in use`,
            redirectUrl: "/user",
         });
      }
      await sqlCreateUser(req.body);

      await sendEmailOTP(req.body.email);
      // await sendPhoneOTP(req.body.phone);

      return res.status(201).json({
         message:
            "User created successfully. Login to verify your email and phone",
         redirectUrl: "/user",
      });
   } catch {
      return res
         .status(500)
         .json({ message: "Failed to create user", redirectUrl: "/" });
   }
};

exports.forgotPassword = async (req, res) => {
   try {
      const { email, phone } = req.body;

      const userEmailCheck = await sqlCheckForExistUser(USERFIELD.EMAIL, email);
      const userPhoneCheck = await sqlCheckForExistUser(USERFIELD.PHONE, phone);

      const userIdentifier = userEmailCheck || userPhoneCheck;

      if (!userIdentifier) {
         return res.status(400).json({
            message: `User not found`,
            redirectUrl: "/user",
         });
      }

      await sendEmailOTP(email);
      await sendPhoneOTP(phone);

      return res.status(200).json({
         message: `OTP sent successfully. Check your email and phone for the OTP`,
         redirectUrl: "/user",
      });
   } catch {
      return res.status(500).json({
         message: "Failed to reset password",
         redirectUrl: "/user",
      });
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

exports.verifyOTP = async (req, res) => {
   try {
      const { type, otp } = req.body;

      const result = await sqlGetOTP(req.user.email, req.user.phone, type);

      const matchOTP = await bcrypt.compare(otp, result.otp_code.toString());
      const expiredOTP = result.expires_at < new Date(Date.now() - 30 * 60000);

      if (!matchOTP) {
         return res.status(403).json({
            message: `Invalid OTP`,
            redirectUrl: "/verifyOTP",
         });
      }
      if (expiredOTP) {
         return res.status(403).json({
            message: `OTP expired. Resend OTP to verify`,
            redirectUrl: "/verifyOTP",
         });
      }

      await sqlUpdateVerifiedStatus(req.user, type);

      return res.status(200).json({
         message: `OTP verified successfully`,
         redirectUrl: "/verifyOTP",
      });
   } catch {
      return res.status(500).json({
         message: "Failed to verify OTP",
         redirectUrl: "/verifyOTP",
      });
   }
};

exports.resendOTP = async (req, res) => {
   try {
      const { type } = req.body;

      if (type === USERFIELD.EMAIL) {
         await sendEmailOTP(req.body.email);
      }
      if (type === USERFIELD.PHONE) {
         await sendPhoneOTP(req.user.phone);
      }

      return res.status(200).json({
         message: `OTP resent successfully. Check your ${type} for the OTP`,
         redirectUrl: "/verifyOTP",
      });
   } catch {
      return res.status(500).json({
         message: "Failed to resend OTP",
         redirectUrl: "/verifyOTP",
      });
   }
};

exports.create = async (req, res) => {
   try {
      const notValid = createValidator(req.body);
      if (notValid) {
         return res
            .status(400)
            .json({ message: notValid, redirectUrl: "/create" });
      }

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

      let verifiedStatus = req.user.verified_status;
      const { email, phone } = req.body;

      /*
      if (req.user.email !== email && req.user.phone !== phone) {
         verifiedStatus = "UNVERIFIED";
      } else if (req.user.email !== email) {
         verifiedStatus = "PHONE_VERIFIED";
      } else if (req.user.phone !== phone) {
         verifiedStatus = "EMAIL_VERIFIED";
      }
      */
      if (req.user.email !== email) {
         verifiedStatus = VERIFIEDSTATUS.PHONE_VERIFIED;
      }

      if (verifiedStatus !== VERIFIEDSTATUS.PHONE_VERIFIED) {
         await sendPhoneOTP(phone);
      }
      if (verifiedStatus !== VERIFIEDSTATUS.EMAIL_VERIFIED) {
         await sendEmailOTP(email);
      }

      await sqlUpdateProfile(req.body, verifiedStatus);

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
         await sqlGetPassword(req.body.id)
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
