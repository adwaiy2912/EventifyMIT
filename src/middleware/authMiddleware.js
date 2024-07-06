const { sqlGetOrganizerID } = require("../models/organizerGetModels");
const { getUserType } = require("../utils/userUtils");

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
   if (req.user.verified_status === "BOTH_VERIFIED") {
      return next();
   }
   res.redirect("/verifyOTP");
};

checkForOrganizer = (req, res, next) => {
   if (getUserType(req.user) === "ORGANIZER") {
      return next();
   }
   res.redirect("/home");
};

checkForAttendee = (req, res, next) => {
   if (getUserType(req.user) === "ATTENDEE") {
      return next();
   }
   res.redirect("/home");
};

checkForOrganizerID = async (req, res, next) => {
   if (
      getUserType(req.user) === "ATTENDEE" ||
      (getUserType(req.user) === "ORGANIZER" &&
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
