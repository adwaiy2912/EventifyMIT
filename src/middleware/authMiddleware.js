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

module.exports = {
   checkAuthenticated,
   checkNotAuthenticated,
   checkForOrganizer,
   checkForAttendee,
};
