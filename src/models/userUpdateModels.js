const bcrypt = require("bcrypt");
const { pool } = require("../config/postgres");

const { sqlGetVerifiedStatus } = require("./userGetModels");
const { getUserType } = require("../utils/userUtils");

sqlUpdateVerifiedStatus = async (user, type) => {
   try {
      const userType = getUserType(user);
      const table = userType + "S";
      const ID = userType + "_ID";

      let newStatus = "BOTH_VERIFIED";
      const status = await sqlGetVerifiedStatus(user.email, userType);
      if (status === "UNVERIFIED") {
         newStatus = type === "email" ? "EMAIL_VERIFIED" : "PHONE_VERIFIED";
      }

      await pool.query(
         `UPDATE ${table} SET VERIFIED_STATUS = $1 WHERE ${ID} = $2`,
         [newStatus, user[ID.toLowerCase()]]
      );
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
      const table = data.user + "S";
      const ID = data.user + "_ID";

      await pool.query(
         `UPDATE ${table} SET NAME = $1, EMAIL = $2, PHONE = $3, VERIFIED_STATUS = $4 WHERE ${ID} = $5`,
         [data.name, data.email, data.phone, verifiedStatus, data.id]
      );
   } catch (error) {
      console.error(error);
      throw error;
   }
};

sqlUpdatePassword = async (data) => {
   try {
      const table = data.user + "S";
      const ID = data.user + "_ID";
      const hashedPassword = await bcrypt.hash(data.newPassword, 10);

      await pool.query(`UPDATE ${table} SET PASSWORD = $1 WHERE ${ID} = $2`, [
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
