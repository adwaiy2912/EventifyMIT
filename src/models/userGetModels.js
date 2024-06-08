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
sqlGetEventDetails = async (ID) => {
   try {
      const result = await pool.query(
         `SELECT * FROM EVENTS WHERE EVENT_ID = $1`,
         [ID]
      );
      return result.rows[0];
   } catch (error) {
      console.error(error);
      throw error;
   }
};
sqlGetRegistrationStatus = async (eventID, attendeeID) => {
   try {
      const result = await pool.query(
         `SELECT * FROM REGISTRATIONS WHERE EVENT_ID = $1 AND ATTENDEE_ID = $2`,
         [eventID, attendeeID]
      );
      return result.rows.length !== 0 ? "REGISTER" : "UNREGISTER";
   } catch (error) {
      console.error(error);
      throw error;
   }
};
sqlGetEventType = async (ID) => {
   try {
      const result = await pool.query(
         `SELECT EVENT_TYPE_NAME FROM EVENT_TYPES WHERE EVENT_TYPE_ID = $1`,
         [ID]
      );
      return result.rows[0].event_type_name;
   } catch (error) {
      console.error(error);
      throw error;
   }
};
sqlGetVenue = async (ID) => {
   try {
      const result = await pool.query(
         `SELECT NAME, LOCATION FROM VENUES WHERE VENUE_ID = $1`,
         [ID]
      );
      return result.rows[0];
   } catch (error) {
      console.error(error);
      throw error;
   }
};
sqlGetOrganizerUpcommingEvents = async (ID) => {
   try {
      const result = await pool.query(
         `SELECT * FROM EVENTS WHERE ORGANIZER_ID = $1 WHERE event_date >= NOW()`,
         [ID]
      );
      return result.rows;
   } catch (error) {
      console.error(error);
      throw error;
   }
};
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
sqlGetOrganizerPreviousEvents = async (ID) => {
   try {
      const result = await pool.query(
         `SELECT * FROM EVENTS WHERE ORGANIZER_ID = $1 WHERE event_date < NOW()`,
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
   sqlGetVenueID,
   sqlGetEventDetails,
   sqlGetRegistrationStatus,
   sqlGetEventType,
   sqlGetVenue,
   sqlGetOrganizerUpcommingEvents,
   sqlGetAttendeeUpcommingEvents,
   sqlGetOrganizerPreviousEvents,
   sqlGetAttendeePreviousEvents,
};
