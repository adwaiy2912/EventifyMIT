const { Op } = require("sequelize");
const { Event, Registrations } = require("../models/index");

historyOrganizerPreviousEvents = async (organizerId) => {
   try {
      return await Event.findAll({
         where: {
            organizer_id: organizerId,
            start_time: {
               [Op.lt]: new Date(),
            },
         },
         order: [["start_time", "DESC"]],
      });
   } catch (error) {
      console.error("Error fetching organizer previous events:", error);
      throw error;
   }
};

historyAttendeePreviousEvents = async (attendeeId) => {
   try {
      return await Event.findAll({
         where: {
            start_time: {
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
         order: [["start_time", "DESC"]],
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
