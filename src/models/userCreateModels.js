const bcrypt = require("bcrypt");
const { pool } = require("../config/postgres");

sqlCreateUser = async (data) => {
   try {
      const table =
         data.type === "organizer"
            ? "ORGANIZERS"
            : data.type === "attendee"
            ? "ATTENDEES"
            : "";
      const ID = table.slice(0, -1) + "_ID";
      const hashedPassword = await bcrypt.hash(data.password, 10);

      await pool.query(
         `INSERT INTO ${table} (${ID}, NAME, EMAIL, PHONE, PASSWORD) VALUES ($1, $2, $3, $4, $5)`,
         [data.regNo, data.name, data.email, data.phone, hashedPassword]
      );
   } catch (error) {
      console.error(error);
      throw error;
   }
};
sqlCreateEvent = async (data, eventID, venueID, organizerID) => {
   try {
      await pool.query(
         `INSERT INTO EVENTS (EVENT_ID, EVENT_NAME, EVENT_DESCRIPTION, EVENT_TYPE_ID, VENUE_ID, ORGANIZER_ID, EVENT_DATE, EVENT_TIME, REGISTRATION_DEADLINE, FEES) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
         [
            eventID,
            data.name,
            data.description,
            data.eventType,
            venueID,
            organizerID,
            data.date,
            data.time,
            data.deadline,
            data.fee,
         ]
      );
   } catch (error) {
      console.error(error);
      throw error;
   }
};
sqlCreateVenueID = async (name, location) => {
   try {
      await pool.query(`INSERT INTO VENUES (NAME, LOCATION) VALUES ($1, $2)`, [
         name,
         location,
      ]);
      return await pool.query(
         `SELECT VENUE_ID FROM VENUES WHERE NAME = $1 AND LOCATION = $2`,
         [name, location]
      );
   } catch (error) {
      console.error(error);
      throw error;
   }
};
sqlCreateRegistration = async (eventID, attendeeID, paymentStatus) => {
   try {
      await pool.query(
         `INSERT INTO REGISTRATIONS (EVENT_ID, ATTENDEE_ID, REGISTRATION_DATE, PAYMENT_STATUS) VALUES ($1, $2, CURRENT_DATE, $3)`,
         [eventID, attendeeID, paymentStatus]
      );
   } catch (error) {
      console.error(error);
      throw error;
   }
};

module.exports = {
   sqlCreateUser,
   sqlCreateEvent,
   sqlCreateVenueID,
   sqlCreateRegistration,
};
