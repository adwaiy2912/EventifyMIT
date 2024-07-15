const { pool } = require("../config/postgres");

sqlCheckForExistUser = async (field, value) => {
   try {
      const result = await pool.query(
         `SELECT * FROM USERS WHERE ${field} = $1`,
         [value]
      );

      if (result.rows.length === 0) {
         return;
      } else {
         return value;
      }
   } catch (error) {
      console.error(error);
      throw error;
   }
};

module.exports = {
   sqlCheckForExistUser,
};
