const { Op } = require("sequelize");
const { Events } = require("../models/event");
const { Registrations } = require("../models/registration");

historyOrganizerPreviousEvents = async (organizerId) => {
   try {
      return await Events.findAll({
         where: {
            organizer_id: organizerId,
            event_date: {
               [Op.lt]: new Date(),
            },
         },
         order: [["event_date", "DESC"]],
      });
   } catch (error) {
      console.error("Error fetching organizer previous events:", error);
      throw error;
   }
};

historyAttendeePreviousEvents = async (attendeeId) => {
   try {
      return await Events.findAll({
         where: {
            event_date: {
               [Op.lt]: new Date(),
            },
         },
         include: [
            {
               model: Registrations,
               as: "registrations",
               where: {
                  attendee_id: attendeeId,
               },
               attributes: [],
            },
         ],
         order: [["event_date", "DESC"]],
      });
   } catch (error) {
      console.error("Error fetching attendee previous events:", error);
      throw error;
   }
};

module.exports = {
   historyOrganizerPreviousEvents,
   historyAttendeePreviousEvents,
};
