const { Op } = require("sequelize");
const { Registration } = require("../models/registration");
const { User } = require("../models/user");

viewEventRegistrations = async (eventId) => {
   return await Registrations.findAll({
      where: { event_id: eventId },
      include: [
         {
            model: User,
            as: "attendee",
            attributes: ["id", "name", "email"],
         },
      ],
   });
};

module.exports = {
   viewEventRegistrations,
};
