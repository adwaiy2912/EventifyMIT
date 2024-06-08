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

module.exports = {
   sqlCheckForExistUser,
};
