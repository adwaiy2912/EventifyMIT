const express = require("express");
const router = express.Router();
const {
   checkAuthenticated,
   checkNotAuthenticated,
   checkVerified,
   checkForOrganizer,
   checkForAttendee,
   checkForOrganizerID,
} = require("../middleware/authMiddleware");
const indexController = require("../controllers/indexController");

router.get("/", checkNotAuthenticated, (req, res) => {
   res.render("root", {});
});

router.get("/home", checkAuthenticated, checkVerified, (req, res) => {
   res.render("home", { user: req.user.user_type });
});

router.get("/user", checkNotAuthenticated, (req, res) => {
   res.render("login_signup", {});
});

router.get("/verifyOTP", checkAuthenticated, indexController.verifyOTP);

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
