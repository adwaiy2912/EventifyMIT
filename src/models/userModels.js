const bcrypt = require("bcrypt");
const { pool } = require("../config/postgres");

sqlCheckForExistUser = async (field, value) => {
   try {
      let org_field, att_field;
      if (field === "ID") {
         att_field = "attendee_id";
         org_field = "organizer_id";
      } else {
         org_field = att_field = field;
      }

      const result1 = await pool.query(
         `SELECT * FROM ORGANIZERS WHERE ${org_field} = $1`,
         [value]
      );
      const result2 = await pool.query(
         `SELECT * FROM ATTENDEES WHERE ${att_field} = $1`,
         [value]
      );

      if (result1.rows.length === 0 && result2.rows.length === 0) {
         return;
      } else {
         return `${field} already exists`;
      }
   } catch (error) {
      console.error(error);
      throw error;
   }
};
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
sqlEventTypes = async () => {
   try {
      const result = await pool.query(`SELECT * FROM EVENT_TYPES`);
      return result.rows;
   } catch (error) {
      console.error(error);
      throw error;
   }
};
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
sqlFindEvents = async (ID) => {
   try {
      const result =
         await pool.query(`SELECT EVENT_ID, EVENT_NAME, EVENT_DESCRIPTION, EVENT_TYPE_ID, EVENT_DATE, EVENT_TIME, REGISTRATION_DEADLINE FROM EVENTS WHERE event_date >= NOW()
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
      return result.rows.length !== 0 ? "REGISTER" : "UNREGISTER";
   } catch (error) {
      console.error(error);
      throw error;
   }
};

module.exports = {
   sqlCheckForExistUser,
   sqlCreateUser,
   sqlCreateEvent,
   sqlEventTypes,
   sqlGetVenueID,
   sqlFindEvents,
   sqlGetEventDetails,
   sqlGetRegistrationStatus,
};
