const { pool } = require("../config/postgres");

sqlGetAttendeeUpcommingEvents = async (ID) => {
   try {
      const result = await pool.query(
         `SELECT * FROM EVENTS WHERE event_date >= NOW() AND EVENT_ID IN (SELECT EVENT_ID FROM REGISTRATIONS WHERE ATTENDEE_ID = $1)`,
         [ID]
      );
      return result.rows;
   } catch (error) {
      console.error(error);
      throw error;
   }
};
sqlGetAttendeePreviousEvents = async (ID) => {
   try {
      const result = await pool.query(
         `SELECT * FROM EVENTS WHERE event_date < NOW() AND EVENT_ID IN (SELECT EVENT_ID FROM REGISTRATIONS WHERE ATTENDEE_ID = $1)`,
         [ID]
      );
      return result.rows;
   } catch (error) {
      console.error(error);
      throw error;
   }
};

module.exports = {
   sqlGetAttendeeUpcommingEvents,
   sqlGetAttendeePreviousEvents,
};
