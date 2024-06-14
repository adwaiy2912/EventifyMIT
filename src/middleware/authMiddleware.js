const { sqlGetOrganizerID } = require("../models/organizerGetModels");
const { getUserType } = require("../utils/userUtils");

checkAuthenticated = (req, res, next) => {
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
   checkForOrganizer,
   checkForAttendee,
   checkForOrganizerID,
};
