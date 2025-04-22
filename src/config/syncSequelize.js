const sequelize = require("./sequelize");
const User = require("../models/user");
const Event = require("../models/event");
const Venue = require("../models/venue");
const EventType = require("../models/eventType");
const Registration = require("../models/registration");
const OTP = require("../models/otp");

async function syncSequelize() {
   try {
      await sequelize.authenticate();
      console.log("🛠️ Sequelize connection established.");

      await Promise.all([
         User.sync({ alter: true }),
         Event.sync({ alter: true }),
         Venue.sync({ alter: true }),
         EventType.sync({ alter: true }),
         Registration.sync({ alter: true }),
         OTP.sync({ alter: true }),
      ]);

      console.log("📊 Database & tables created!");
   } catch (error) {
      console.error("Error during syncSequelize:", error);
   }
}

module.exports = { syncSequelize };
