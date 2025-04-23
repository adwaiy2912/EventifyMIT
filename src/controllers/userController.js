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
const { USER_FIELD, VERIFIED_STATUS } = require("../utils/constants");
const { generateUniqueString, getVenueID } = require("../utils/helper");

const { sendEmailOTP, sendPhoneOTP } = require("../utils/sendOTP");

const { User, OTP } = require("../models/index");

const { userExists, createUser } = require("../services/signup");

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

      // Check if email or registration number already exists
      const existingUser = await userExists(req.body.email, req.body.regNo);
      if (existingUser) {
         const field = existingUser.email === req.body.email ? "Email" : "ID";
         return res.status(400).json({
            message: `${field} already in use`,
            redirectUrl: "/user",
         });
      }

      await createUser(req.body);

      // Send OTP to email and phone
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
      const user = await User.findOne({
         where: {
            [Op.or]: [{ email }, { phone }],
         },
      });

      if (!user) {
         return res.status(400).json({
            message: `User not found`,
            redirectUrl: "/user",
         });
      }

      await sendEmailOTP(email);
      // await sendPhoneOTP(phone);

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
      const { email, phone } = req.user;

      const result = await OTP.findOne({
         where: {
            user_email: email,
            user_phone: phone,
            type,
         },
         order: [["created_at", "DESC"]],
      });

      if (!result) {
         return res.status(404).json({
            message: "OTP not found",
            redirectUrl: "/verifyOTP",
         });
      }

      const matchOTP = await bcrypt.compare(otp, result.otp_code.toString());
      const expiredOTP =
         new Date(result.expires_at) < new Date(Date.now() - 30 * 60000); // 30 min expiry

      if (!matchOTP) {
         return res.status(403).json({
            message: "Invalid OTP",
            redirectUrl: "/verifyOTP",
         });
      }
      if (expiredOTP) {
         return res.status(403).json({
            message: "OTP expired. Resend OTP to verify",
            redirectUrl: "/verifyOTP",
         });
      }

      // Update user's verified status based on type
      const updateFields = {};
      if (type === "email") updateFields.email_verified = true;
      if (type === "phone") updateFields.phone_verified = true;

      await User.update(updateFields, {
         where: { id: req.user.id },
      });

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
      const { type, email } = req.body;

      if (type === USER_FIELD.EMAIL) {
         await sendEmailOTP(email || req.user.email);
      } else if (type === USER_FIELD.PHONE) {
         await sendPhoneOTP(req.user.phone);
      } else {
         return res.status(400).json({
            message: "Invalid OTP type",
            redirectUrl: "/verifyOTP",
         });
      }

      return res.status(200).json({
         message: `OTP resent successfully. Check your ${type} for the OTP`,
         redirectUrl: "/verifyOTP",
      });
   } catch (error) {
      console.error("Error resending OTP:", error);
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

      await Event.create({
         id: eventID,
         name: req.body.name,
         description: req.body.description,
         event_type_id: req.body.event_type_id,
         organizer_id: req.user.organizer_id,
         venue_id: venueID,
         event_date: req.body.event_date,
         registration_deadline: req.body.registration_deadline,
      });

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
         VERIFIED_STATUS = VERIFIED_STATUS.PHONE_VERIFIED;
      }

      if (VERIFIED_STATUS !== VERIFIED_STATUS.PHONE_VERIFIED) {
         await sendPhoneOTP(phone);
      }
      if (VERIFIED_STATUS !== VERIFIED_STATUS.EMAIL_VERIFIED) {
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
