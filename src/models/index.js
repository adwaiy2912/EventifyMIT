const Sequelize = require("sequelize");
const sequelize = require("../config/sequelize");

const User = require("./user")(sequelize, Sequelize.DataTypes);
const Event = require("./event")(sequelize, Sequelize.DataTypes);
const Venue = require("./venue")(sequelize, Sequelize.DataTypes);
const EventType = require("./eventType")(sequelize, Sequelize.DataTypes);
const Registration = require("./registration")(sequelize, Sequelize.DataTypes);
const OTP = require("./otp")(sequelize, Sequelize.DataTypes);

module.exports = {
   sequelize,
   Sequelize,
   User,
   Event,
   Venue,
   EventType,
   Registration,
   OTP,
};
