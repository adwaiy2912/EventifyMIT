const { pool } = require("../config/postgres");

sqlUpdateEvent = async (data, venueID) => {
   try {
      await pool.query(
         `UPDATE EVENTS SET EVENT_NAME = $1, EVENT_DESCRIPTION = $2, EVENT_TYPE_ID = $3, VENUE_ID = $4, EVENT_DATE = $5, EVENT_TIME = $6, REGISTRATION_DEADLINE = $7, FEES = $8 WHERE EVENT_ID = $9`,
         [
            data.name,
            data.description,
            data.eventType,
            venueID,
            data.date,
            data.time,
            data.deadline,
            data.fee,
            data.event_id,
         ]
      );
   } catch (error) {
      console.error(error);
      throw error;
   }
};

module.exports = {
   sqlUpdateEvent,
};
