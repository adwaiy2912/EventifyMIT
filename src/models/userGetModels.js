const { pool } = require("../config/postgres");
const { REGISTRATIONSTATUS } = require("../utils/enumObj");

sqlGetOTP = async (email, phone, type) => {
   try {
      if (type === "email") {
         const result = await pool.query(
            `SELECT OTP_CODE FROM OTP WHERE EMAIL = $1`,
            [email]
         );
         return result.rows[0];
      } else {
         const result = await pool.query(
            `SELECT OTP_CODE FROM OTP WHERE PHONE = $1`,
            [phone]
         );
         return result.rows[0];
      }
   } catch (error) {
      console.error(error);
      throw error;
   }
};

sqlGetEventTypes = async () => {
   try {
      const result = await pool.query(`SELECT * FROM EVENT_TYPES`);
      return result.rows;
   } catch (error) {
      console.error(error);
      throw error;
   }
};

sqlGetFindEvents = async (ID) => {
   try {
      const result =
         await pool.query(`SELECT * FROM EVENTS WHERE event_date >= NOW()
       `);
      return result.rows;
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
      return result.rows.length !== 0
         ? REGISTRATIONSTATUS.REGISTERED
         : REGISTRATIONSTATUS.UNREGISTERED;
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

sqlGetPassword = async (ID) => {
   try {
      const result = await pool.query(
         `SELECT PASSWORD FROM USERS WHERE ID = $1`,
         [ID]
      );
      return result.rows[0].password;
   } catch (error) {
      console.error(error);
      throw error;
   }
};

module.exports = {
   sqlGetOTP,
   sqlGetEventTypes,
   sqlGetFindEvents,
   sqlGetEventDetails,
   sqlGetRegistrationStatus,
   sqlGetEventType,
   sqlGetVenue,
   sqlGetPassword,
};
