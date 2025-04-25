const { Op } = require("sequelize");
const { Event, Registration } = require("../models/index");

const historyOrganizerPreviousEvents = async (organizerId) => {
   try {
      return await Event.findAll({
         where: {
            organizer_id: organizerId,
            start_time: {
               [Op.lt]: new Date(),
            },
         },
         order: [["start_time", "DESC"]],
         raw: true,
      });
   } catch (error) {
      console.error("Error fetching organizer previous events:", error);
      throw error;
   }
};

const historyAttendeePreviousEvents = async (attendee_id) => {
   try {
      return await Event.findAll({
         where: {
            start_time: {
               [Op.lt]: new Date(),
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
         order: [["start_time", "DESC"]],
         raw: true,
         nest: true,
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
