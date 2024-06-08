const { pool } = require("../config/postgres");

sqlEventTypes = async () => {
   try {
      const result = await pool.query(`SELECT * FROM EVENT_TYPES`);
      return result.rows;
   } catch (error) {
      console.error(error);
      throw error;
   }
};
sqlFindEvents = async (ID) => {
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

module.exports = {
   sqlEventTypes,
   sqlFindEvents,
};
