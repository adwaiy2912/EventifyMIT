const { User } = require("../models/index");
const { USER_TYPE, VERIFIED_STATUS } = require("../utils/constants");

const checkAuthenticated = async (req, res, next) => {
   if (req.isAuthenticated()) {
      return next();
   }
   res.redirect("/");
};

const checkNotAuthenticated = (req, res, next) => {
   if (req.isAuthenticated()) {
      return res.redirect("/home");
   }
   next();
};

const checkVerified = async (req, res, next) => {
   if (req.user.verified_status === VERIFIED_STATUS.BOTH_VERIFIED) {
      return next();
   }
   res.redirect("/verifyOTP");
};

const checkForOrganizer = (req, res, next) => {
   if (req.user.user_type === USER_TYPE.ORGANIZER) {
      return next();
   }
   res.redirect("/home");
};

const checkForAttendee = (req, res, next) => {
   if (req.user.user_type === USER_TYPE.ATTENDEE) {
      return next();
   }
   res.redirect("/home");
};

const checkForOrganizerID = async (req, res, next) => {
   if (
      req.user.user_type === USER_TYPE.ATTENDEE ||
      (req.user.user_type === USER_TYPE.ORGANIZER &&
         req.user.organizer_id ===
            (await User.findByPk(req.user.id)).organizer_id)
   ) {
      return next();
   }
   res.redirect("/home");
};

module.exports = {
   checkAuthenticated,
   checkNotAuthenticated,
   checkVerified,
   checkForOrganizer,
   checkForAttendee,
   checkForOrganizerID,
};
