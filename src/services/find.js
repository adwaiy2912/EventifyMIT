const { Op } = require("sequelize");
const { Events } = require("../models/event");

findAllEvents = async () => {
   const today = new Date();
   today.setHours(0, 0, 0, 0);

   try {
      const events = await Events.findAll({
         where: {
            event_date: {
               [Op.gte]: today,
            },
         },
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
