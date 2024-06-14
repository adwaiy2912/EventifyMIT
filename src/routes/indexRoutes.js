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

router.get("/home", checkAuthenticated, (req, res) => {
   res.render("home", { user: getUserType(req.user) });
});

router.get("/user", checkNotAuthenticated, (req, res) => {
   res.render("login_signup", {});
});

router.get("/dashboard", checkAuthenticated, indexController.dashboard);

router.get("/find", checkAuthenticated, checkForAttendee, indexController.find);

router.get(
   "/create",
   checkAuthenticated,
   checkForOrganizer,
   indexController.create
);

router.get("/manage", checkAuthenticated, indexController.manage);

router.get("/history", checkAuthenticated, indexController.history);

router.get(
   "/event/:id",
   checkAuthenticated,
   checkForOrganizerID,
   indexController.eventID
);

router.get(
   "/view/:id",
   checkAuthenticated,
   checkForOrganizer,
   indexController.viewID
);

module.exports = router;
