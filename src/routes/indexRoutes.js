const express = require("express");
const router = express.Router();
const {
   checkAuthenticated,
   checkNotAuthenticated,
   checkForAttendee,
   checkForOrganizer,
} = require("../middleware/authMiddleware");
const { getUserType } = require("../utils/userUtils");

router.get("/", checkNotAuthenticated, (req, res) => {
   res.render("root", {});
});
router.get("/home", checkAuthenticated, (req, res) => {
   res.render("home", { user: getUserType(req.user) });
});
router.get("/user", checkNotAuthenticated, (req, res) => {
   res.render("user", {});
});
router.get("/dashboard", checkAuthenticated, (req, res) => {
   res.render("dashboard", {
      ID: req.user.attendee_id || req.user.organizer_id,
      user: getUserType(req.user),
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
   });
});
router.get("/find", checkAuthenticated, checkForAttendee, (req, res) => {
   res.render("find", { user: getUserType(req.user) });
});
router.get("/create", checkAuthenticated, checkForOrganizer, (req, res) => {
   res.render("create", { user: getUserType(req.user) });
});
router.get("/manage", checkAuthenticated, (req, res) => {
   res.render("manage", { user: getUserType(req.user) });
});
router.get("/history", checkAuthenticated, (req, res) => {
   res.render("history", { user: getUserType(req.user) });
});
router.get("/view", (req, res) => {
   res.render("view", { user: "ORGANIZER" });
});

router.get(
   "/manage/:id",
   // checkAuthenticated,
   (req, res) => {
      res.render("event", {
         // user: req.user[6],
         // name: eventData[req.params.id][2],
         // type: eventData[req.params.id][4], // get using SQL
         // date: getDate(eventData[req.params.id][7]),
         // time: getTime(eventData[req.params.id][8]),
         // deadline: getDate(eventData[req.params.id][9]),
         // venue: eventData[req.params.id][5], // get using SQL
         // desc: eventData[req.params.id][3],
         // status: eventData[req.params.id][12],
         user: "ATTENDEE",
         name: eventData[req.params.id][2],
         type: eventData[req.params.id][4], // get using SQL
         date: getDate(eventData[req.params.id][7]),
         time: getTime(eventData[req.params.id][8]),
         deadline: getDate(eventData[req.params.id][9]),
         venue: eventData[req.params.id][5], // get using SQL
         desc: eventData[req.params.id][3],
         status: 1,
      });
   }
);

module.exports = router;
