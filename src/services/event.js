const { Registration } = require("../models/index");
const { REGISTRATION_STATUS } = require("../utils/constants");

eventRegistrationStatus = async (eventId, userId) => {
   const registration = await Registration.findOne({
      where: {
         event_id: eventId,
         attendee_id: userId,
      },
   });
   return registration
      ? REGISTRATION_STATUS.REGISTERED
      : REGISTRATION_STATUS.UNREGISTERED;
};

module.exports = {
   eventRegistrationStatus,
};
