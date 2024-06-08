const {
   sqlCreateUser,
   sqlCreateEvent,
   sqlCreateRegistration,
} = require("../models/userCreateModels");
const { sqlCheckForExistUser } = require("../models/utilsModels");

const { generateUniqueString, getVenueID } = require("../utils/userUtils");

exports.signup = async (req, res) => {
   try {
      // const userCheck = users.find((user) => user.email === req.body.email);
      console.log(req.body);
      const userEmailCheck = await sqlCheckForExistUser(
         "email",
         req.body.email
      );
      const userIDCheck = await sqlCheckForExistUser("ID", req.body.regNo);
      if (userEmailCheck || userIDCheck) {
         console.log(userEmailCheck || userIDCheck);
         return res.status(400).redirect("/user");
      }
      if (req.body.password !== req.body.confirmPassword) {
         console.log("user pass wrong");
         return res.status(403).redirect("/user");
      }
      await sqlCreateUser(req.body);
      console.log("user created");
      return res.status(200).redirect("/home");
   } catch {
      console.log("error occured");
      return res.status(500).redirect("/user");
   }
};

exports.create = async (req, res) => {
   try {
      console.log(req.body);
      const eventID = generateUniqueString(10);
      const venueID = await getVenueID(req.body.venue);
      await sqlCreateEvent(req.body, eventID, venueID, req.user.organizer_id);
      console.log("event created");
      return res.status(200).redirect("/home");
   } catch {
      console.log("error occured");
      return res.status(500).redirect("/");
   }
};

exports.register = async (req, res) => {
   try {
      let { eventID, userID, paymentStatus } = req.body;
      if (paymentStatus === "PENDING") {
         await paymentAPI(req.body);
      }
      if (paymentStatus === "FAILED") {
         console.log("payment failed");
         return res.status(400).redirect("/home");
      }
      await sqlCreateRegistration(eventID, userID, paymentStatus);

      console.log("user registered");
      const redirectUrl = req.get("referer") || "/home";
      console.log(redirectUrl);
      return res.status(200).redirect(redirectUrl);
   } catch {
      console.log("error occured");
      return res.status(500).redirect("/home");
   }
};
