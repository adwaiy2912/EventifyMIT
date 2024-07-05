const { pool } = require("../config/postgres");

sqlDeleteEmailOTP = async (email) => {
   try {
      await pool.query(`DELETE FROM OTP WHERE EMAIL = $1`, [email]);
   } catch (error) {
      console.error(error);
      throw error;
   }
};

sqlDeletePhoneOTP = async (phone) => {
   try {
      await pool.query(`DELETE FROM OTP WHERE PHONE = $1`, [phone]);
   } catch (error) {
      console.error(error);
      throw error;
   }
};

module.exports = { sqlDeleteEmailOTP, sqlDeletePhoneOTP };
