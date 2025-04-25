const { raw } = require("express");
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
      raw: true,
      nest: true,
      order: [["createdAt", "DESC"]],
   });
};

module.exports = {
   viewEventRegistrations,
};
