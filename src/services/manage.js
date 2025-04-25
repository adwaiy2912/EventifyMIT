const { Op } = require("sequelize");
const { Event, Registration } = require("../models/index");

const manageOrganizerUpcomingEvents = async (organizerId) => {
   try {
      return await Event.findAll({
         where: {
            organizer_id: organizerId,
            start_time: {
               [Op.gte]: new Date(),
            },
         },
         order: [["start_time", "ASC"]],
         raw: true,
      });
   } catch (error) {
      console.error("Error fetching organizer events:", error);
      throw error;
   }
};

const manageAttendeeUpcomingEvents = async (attendee_id) => {
   try {
      return await Event.findAll({
         where: {
            start_time: {
               [Op.gte]: new Date(),
            },
         },
         include: [
            {
               model: Registration,
               as: "registrations",
               where: {
                  attendee_id,
               },
               required: true,
               attributes: [],
            },
         ],
         order: [["start_time", "ASC"]],
         raw: true,
         nest: true,
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
