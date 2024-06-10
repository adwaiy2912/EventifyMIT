const express = require("express");
const router = express.Router();
const {
   checkAuthenticated,
   checkNotAuthenticated,
   checkForAttendee,
   checkForOrganizer,
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
   res.render("user", {});
});

router.get("/dashboard", indexController.dashboard);

router.get("/find", indexController.find);

router.get("/create", indexController.create);

router.get("/manage", indexController.manage);

router.get("/history", indexController.history);

router.get("/view", (req, res) => {
   res.render("view", { user: "ORGANIZER" });
});

router.get("/event/:id", indexController.eventID);

module.exports = router;
