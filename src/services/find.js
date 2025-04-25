const { Op } = require("sequelize");
const { Event } = require("../models/index");

const findAllEvents = async () => {
   const today = new Date();
   today.setHours(0, 0, 0, 0);

   try {
      const events = await Event.findAll({
         where: {
            start_time: {
               [Op.gte]: today,
            },
         },
         order: [["start_time", "ASC"]],
         raw: true,
         nest: true,
      });
      return events;
   } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
   }
};

module.exports = {
   findAllEvents,
};
