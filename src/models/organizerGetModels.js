const { pool } = require("../config/postgres");
const { sqlCreateVenueID } = require("./userCreateModels");

sqlGetVenueID = async (name, location) => {
   try {
      const result = await pool.query(
         `SELECT VENUE_ID FROM VENUES WHERE NAME = $1 AND LOCATION = $2`,
         [name, location]
      );
      if (result.rows.length === 0) {
         return await sqlCreateVenueID(name, location);
      }
      return result;
   } catch (error) {
      console.error(error);
      throw error;
   }
};

sqlGetAttendeeData = async (IDs) => {
   try {
      const result = await pool.query(
         `SELECT ATTENDEE_ID, NAME, EMAIL, PHONE FROM ATTENDEES WHERE ATTENDEE_ID = ANY($1)`,
         [IDs]
      );
      return result.rows;
   } catch (error) {
      console.error(error);
      throw error;
   }
};

sqlGetOrganizerUpcommingEvents = async (ID) => {
   try {
      const result = await pool.query(
         `SELECT * FROM EVENTS WHERE ORGANIZER_ID = $1 AND event_date >= NOW()`,
         [ID]
      );
      return result.rows;
   } catch (error) {
      console.error(error);
      throw error;
   }
};

sqlGetOrganizerPreviousEvents = async (ID) => {
   try {
      const result = await pool.query(
         `SELECT * FROM EVENTS WHERE ORGANIZER_ID = $1 AND event_date < NOW()`,
         [ID]
      );
      return result.rows;
   } catch (error) {
      console.error(error);
      throw error;
   }
};

sqlGetEventRegistrations = async (ID) => {
   try {
      const result = await pool.query(
         `SELECT * FROM REGISTRATIONS WHERE EVENT_ID = $1`,
         [ID]
      );
      return result.rows;
   } catch (error) {
      console.error(error);
      throw error;
   }
};

module.exports = {
   sqlGetVenueID,
   sqlGetAttendeeData,
   sqlGetOrganizerUpcommingEvents,
   sqlGetOrganizerPreviousEvents,
   sqlGetEventRegistrations,
};
