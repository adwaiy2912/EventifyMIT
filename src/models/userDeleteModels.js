const { pool } = require("../config/postgres");

sqlDeleteEmailOTP = async (email) => {
   try {
      await pool.query(`DELETE FROM OTP WHERE EMAIL = $1`, [email]);
   } catch (error) {
      console.error(error);
      throw error;
   }
};

module.exports = { sqlDeleteEmailOTP };
