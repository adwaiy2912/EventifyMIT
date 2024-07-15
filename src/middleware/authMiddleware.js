const { sqlGetOrganizerID } = require("../models/organizerGetModels");
const { USERTYPE, VERIFIEDSTATUS } = require("../utils/enumObj");

checkAuthenticated = async (req, res, next) => {
   if (req.isAuthenticated()) {
      return next();
   }
   res.redirect("/");
};

checkNotAuthenticated = (req, res, next) => {
   if (req.isAuthenticated()) {
      return res.redirect("/home");
   }
   next();
};

checkVerified = async (req, res, next) => {
   if (req.user.verified_status === VERIFIEDSTATUS.BOTH_VERIFIED) {
      return next();
   }
   res.redirect("/verifyOTP");
};

checkForOrganizer = (req, res, next) => {
   if (req.user.user_type === USERTYPE.ORGANIZER) {
      return next();
   }
   res.redirect("/home");
};

checkForAttendee = (req, res, next) => {
   if (req.user.user_type === USERTYPE.ATTENDEE) {
      return next();
   }
   res.redirect("/home");
};

checkForOrganizerID = async (req, res, next) => {
   if (
      req.user.user_type === USERTYPE.ATTENDEE ||
      (req.user.user_type === USERTYPE.ORGANIZER &&
         req.user.organizer_id === (await sqlGetOrganizerID(req.params.id)))
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
