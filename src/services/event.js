const { Registration } = require("../models/index");
const { REGISTRATION_STATUS } = require("../utils/constants");

const eventRegistrationStatus = async (eventId, userId) => {
   const registration = await Registration.findOne({
      where: {
         event_id: eventId,
         attendee_id: userId,
      },
      raw: true,
   });
   return registration
      ? REGISTRATION_STATUS.REGISTERED
      : REGISTRATION_STATUS.UNREGISTERED;
};

module.exports = {
   eventRegistrationStatus,
};
