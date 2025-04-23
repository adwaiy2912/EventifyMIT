const { Op } = require("sequelize");
const { Events } = require("../models/event");
const { Registrations } = require("../models/registration");

manageOrganizerUpcomingEvents = async (organizerId) => {
   try {
      return await Events.findAll({
         where: {
            organizer_id: organizerId,
            event_date: {
               [Op.gte]: new Date(),
            },
         },
         order: [["event_date", "ASC"]],
      });
   } catch (error) {
      console.error("Error fetching organizer events:", error);
      throw error;
   }
};

manageAttendeeUpcomingEvents = async (attendeeId) => {
   try {
      return await Events.findAll({
         where: {
            event_date: {
               [Op.gte]: new Date(),
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
         order: [["event_date", "ASC"]],
      });
   } catch (error) {
      console.error("Error fetching attendee events:", error);
      throw error;
   }
};

module.exports = {
   manageOrganizerUpcomingEvents,
   manageAttendeeUpcomingEvents,
};
