const { Registration, User } = require("../models/index");

viewEventRegistrations = async (eventId) => {
   return await Registration.findAll({
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
