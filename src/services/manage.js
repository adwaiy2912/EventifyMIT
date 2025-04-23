const { Op } = require("sequelize");
const { Event, Registrations } = require("../models/event");

manageOrganizerUpcomingEvents = async (organizerId) => {
   try {
      return await Event.findAll({
         where: {
            organizer_id: organizerId,
            start_time: {
               [Op.gte]: new Date(),
            },
         },
         order: [["start_time", "ASC"]],
      });
   } catch (error) {
      console.error("Error fetching organizer events:", error);
      throw error;
   }
};

manageAttendeeUpcomingEvents = async (attendeeId) => {
   try {
      return await Event.findAll({
         where: {
            start_time: {
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
         order: [["start_time", "ASC"]],
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
