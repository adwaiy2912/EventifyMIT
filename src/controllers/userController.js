const bcrypt = require("bcrypt");
const passport = require("passport");

const { User, Event, OTP, Registration } = require("../models/index");
const { userExists, createUser } = require("../services/signup");

const {
   loginValidator,
   signupValidator,
   createValidator,
} = require("../utils/formValidator");
const { USER_FIELD, VERIFIED_STATUS } = require("../utils/constants");
const { sendEmailOTP, sendPhoneOTP } = require("../utils/sendOTP");
const { generateUniqueString, getVenueID } = require("../utils/helper");

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
   } catch (error) {
      console.error("Error creating user:", error);
      return res
         .status(500)
         .json({ message: "Failed to create user", redirectUrl: "/" });
   }
};

// not setup yet
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
         message: `OTP sent successfully. Check your email or phone for the OTP`,
         redirectUrl: "/user",
      });
   } catch (error) {
      console.error("Error sending OTP:", error);
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
      const user = email || phone;

      const result = await OTP.findOne({
         where: {
            [type === "email" ? "email" : "phone"]: user,
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
      let verified_status = req.user.verified_status;

      if (
         verified_status === VERIFIED_STATUS.UNVERIFIED &&
         type === USER_FIELD.EMAIL
      ) {
         verified_status = VERIFIED_STATUS.EMAIL_VERIFIED;
      } else if (
         verified_status === VERIFIED_STATUS.UNVERIFIED &&
         type === USER_FIELD.PHONE
      ) {
         verified_status = VERIFIED_STATUS.PHONE_VERIFIED;
      } else if (
         verified_status === VERIFIED_STATUS.EMAIL_VERIFIED &&
         type === USER_FIELD.PHONE
      ) {
         verified_status = VERIFIED_STATUS.BOTH_VERIFIED;
      } else if (
         verified_status === VERIFIED_STATUS.PHONE_VERIFIED &&
         type === USER_FIELD.EMAIL
      ) {
         verified_status = VERIFIED_STATUS.BOTH_VERIFIED;
      } else {
         return res.status(403).json({
            message: "OTP already verified",
            redirectUrl: "/home",
         });
      }

      await User.update(
         { verified_status },
         {
            where: {
               id: req.user.id,
            },
         }
      );

      return res.status(200).json({
         message: `OTP verified successfully`,
         redirectUrl: "/home",
      });
   } catch (error) {
      console.error("Error verifying OTP:", error);
      return res.status(500).json({
         message: "Failed to verify OTP",
         redirectUrl: "/verifyOTP",
      });
   }
};

exports.resendOTP = async (req, res) => {
   try {
      const { type } = req.body;

      if (type === USER_FIELD.EMAIL) {
         await sendEmailOTP(req.user.email);
      } else if (type === USER_FIELD.PHONE) {
         await sendPhoneOTP(req.user.phone);
      } else {
         return res.status(400).json({
            message: "Invalid OTP type",
            redirectUrl: "/verifyOTP",
         });
      }

      return res.status(200).json({
         message: `OTP resent. Check your ${type} for the OTP`,
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

      const venueID = await getVenueID(req.body.venue);

      await Event.create({
         event_id: generateUniqueString(10),
         event_name: req.body.name,
         event_description: req.body.description,
         start_time: new Date(`${req.body.start_date} ${req.body.start_time}`),
         end_time: new Date(`${req.body.end_date} ${req.body.end_time}`),
         registration_deadline: new Date(
            `${req.body.deadline_date} ${req.body.deadline_time}`
         ),
         venue_id: venueID,
         organizer_id: req.user.id,
         fees: req.body.fee,
         event_type_id: req.body.event_type_id,
      });

      return res
         .status(201)
         .json({ message: "Event created successfully", redirectUrl: "/home" });
   } catch (error) {
      console.error("Error creating event:", error);
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
      await Registration.create({
         event_id: eventID,
         attendee_id: userID,
         payment_status: paymentStatus,
      });

      return res.status(200).json({
         message: "Registration successful",
         redirectUrl,
      });
   } catch (error) {
      console.error("Error registering for event:", error);
      return res.status(500).json({
         message: "Failed to register to event",
         redirectUrl: "/home",
      });
   }
};

exports.updateEvent = async (req, res) => {
   try {
      const notValid = createValidator(req.body);
      const redirectUrl = req.get("referer") || "/home";
      if (notValid) {
         return res.status(400).json({ message: notValid, redirectUrl });
      }

      const venueID = await getVenueID(req.body.venue);

      await Event.update(
         {
            event_name: req.body.name,
            event_description: req.body.description,
            start_time: new Date(
               `${req.body.start_date} ${req.body.start_time}`
            ),
            end_time: new Date(`${req.body.end_date} ${req.body.end_time}`),
            registration_deadline: new Date(
               `${req.body.deadline_date} ${req.body.deadline_time}`
            ),
            venue_id: venueID,
            fees: req.body.fee,
            event_type_id: req.body.event_type_id,
         },
         {
            where: {
               event_id: req.body.event_id,
            },
         }
      );

      return res
         .status(200)
         .json({ message: "Event updated successfully", redirectUrl });
   } catch (error) {
      console.error("Error updating event:", error);
      return res.status(500).json({
         message: "Failed to update event",
         redirectUrl: "/home",
      });
   }
};

exports.updateProfile = async (req, res) => {
   try {
      const redirectUrl = req.get("referer") || "/home";

      let verified_status = req.user.verified_status;
      const { name, email, phone } = req.body;

      if (req.user.email !== email && req.user.phone !== phone) {
         verified_status = VERIFIED_STATUS.UNVERIFIED;
      } else if (req.user.email !== email) {
         verified_status = VERIFIED_STATUS.PHONE_VERIFIED;
      } else if (req.user.phone !== phone) {
         verified_status = VERIFIED_STATUS.EMAIL_VERIFIED;
      }

      await User.update(
         {
            name,
            email,
            phone,
            verified_status,
         },
         {
            where: { id: req.user.id },
         }
      );

      // Send OTP to email and phone
      if (req.user.email !== email) {
         await sendEmailOTP(email);
      }
      if (req.user.phone !== phone) {
         await sendPhoneOTP(phone);
      }

      return res
         .status(200)
         .json({ message: "Profile updated successfully", redirectUrl });
   } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({
         message: "Failed to update profile",
         redirectUrl: "/home",
      });
   }
};

exports.updatePassword = async (req, res) => {
   try {
      const redirectUrl = req.get("referer") || "/home";
      const { oldPassword, newPassword, confirmNewPassword } = req.body;

      const isPasswordMatch = await bcrypt.compare(
         oldPassword,
         req.user.password
      );

      if (!isPasswordMatch) {
         return res.status(403).json({
            message: "Old password is incorrect",
            redirectUrl,
         });
      }
      if (newPassword !== confirmNewPassword) {
         return res.status(403).json({
            message: "New password not matching",
            redirectUrl,
         });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.update(
         { password: hashedPassword },
         {
            where: { id: req.user.id },
         }
      );

      return res.status(200).json({
         message: "Password updated successfully",
         redirectUrl,
      });
   } catch (error) {
      console.error("Error updating password:", error);
      return res.status(500).json({
         message: "Failed to update password",
         redirectUrl: "/dashboard",
      });
   }
};
