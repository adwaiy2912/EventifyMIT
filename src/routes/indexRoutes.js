const express = require("express");
const router = express.Router();
const {
   checkAuthenticated,
   checkNotAuthenticated,
   checkForAttendee,
   checkForOrganizer,
   checkForOrganizerID,
} = require("../middleware/authMiddleware");
const indexController = require("../controllers/indexController");
const { getUserType } = require("../utils/userUtils");
const { getEventIconSrc, getEventBgSrc } = require("../utils/minEventCard");

router.get("/", checkNotAuthenticated, (req, res) => {
   res.render("root", {});
});

router.get("/home", checkAuthenticated, checkVerified, (req, res) => {
   res.render("home", { user: getUserType(req.user) });
});

router.get("/user", checkNotAuthenticated, (req, res) => {
   res.render("login_signup", {});
});

router.get("/verifyOTP", checkAuthenticated, async (req, res) => {
   const status = await sqlGetVerifiedStatus(
      req.user.email,
      getUserType(req.user)
   );
   if (status === "BOTH_VERIFIED") {
      return res.redirect("/home");
   }
   res.render("verifyOTP", {
      status,
      email: req.user.email,
      phone: req.user.phone,
      user: getUserType(req.user),
   });
});

router.get("/dashboard", checkAuthenticated, indexController.dashboard);

router.get(
   "/find",
   checkAuthenticated,
   checkVerified,
   checkForAttendee,
   indexController.find
);

router.get(
   "/create",
   checkAuthenticated,
   checkVerified,
   checkForOrganizer,
   indexController.create
);

router.get(
   "/manage",
   checkAuthenticated,
   checkVerified,
   indexController.manage
);

router.get(
   "/history",
   checkAuthenticated,
   checkVerified,
   indexController.history
);

router.get(
   "/event/:id",
   checkAuthenticated,
   checkVerified,
   checkForOrganizerID,
   indexController.eventID
);

router.get(
   "/view/:id",
   checkAuthenticated,
   checkVerified,
   checkForOrganizer,
   indexController.viewID
);

module.exports = router;
