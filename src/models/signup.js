const bcrypt = require("bcrypt");
const { pool } = require("../config/postgres");

sqlCheckForExistUser = async (email) => {
   try {
      const result1 = await pool.query(
         "SELECT * FROM ORGANIZERS WHERE email = $1",
         [email]
      );
      const result2 = await pool.query(
         "SELECT * FROM ATTENDEES WHERE email = $1",
         [email]
      );

      if (result1.rows.length === 0 && result2.rows.length === 0) {
         return "notExist";
      } else {
         return;
      }
   } catch (error) {
      console.error(error);
      throw error;
   }
};
sqlInsertIntoTable = async (data) => {
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

module.exports = { sqlCheckForExistUser, sqlInsertIntoTable };
