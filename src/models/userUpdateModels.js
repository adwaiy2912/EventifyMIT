const bcrypt = require("bcrypt");
const { pool } = require("../config/postgres");
const { USERTYPE, VERIFIEDSTATUS } = require("../utils/constants");

sqlUpdateVerifiedStatus = async (user, type) => {
   try {
      let newStatus = VERIFIEDSTATUS.BOTH_VERIFIED;
      const status = user.verified_status;
      if (status === VERIFIEDSTATUS.UNVERIFIED) {
         newStatus =
            type === "email"
               ? VERIFIEDSTATUS.EMAIL_VERIFIED
               : VERIFIEDSTATUS.PHONE_VERIFIED;
      }

      await pool.query(`UPDATE USERS SET VERIFIED_STATUS = $1 WHERE ID = $2`, [
         newStatus,
         user.id,
      ]);
   } catch (error) {
      console.error(error);
      throw error;
   }
};

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

sqlUpdateProfile = async (data, verifiedStatus) => {
   try {
      await pool.query(
         `UPDATE USERS SET NAME = $1, EMAIL = $2, PHONE = $3, VERIFIED_STATUS = $4 WHERE ID = $5`,
         [data.name, data.email, data.phone, verifiedStatus, data.id]
      );
   } catch (error) {
      console.error(error);
      throw error;
   }
};

sqlUpdatePassword = async (data) => {
   try {
      const hashedPassword = await bcrypt.hash(data.newPassword, 10);

      await pool.query(`UPDATE USERS SET PASSWORD = $1 WHERE ID = $2`, [
         hashedPassword,
         data.id,
      ]);
   } catch (error) {
      console.error(error);
      throw error;
   }
};

module.exports = {
   sqlUpdateVerifiedStatus,
   sqlUpdateEvent,
   sqlUpdateProfile,
   sqlUpdatePassword,
};
