const oracledb = require("oracledb");

async function queryTable() {
   let connection;

   try {
      connection = await oracledb.getConnection({
         user: "SYSTEM",
         password: "tiger",
         connectString: "tcp://0.tcp.in.ngrok.io:19028/XEPDB1",
      });

      const result = await connection.execute("SELECT * FROM SKILL");

      return result.rows;
   } catch (err) {
      console.error("Error querying table:", err);
      throw err;
   } finally {
      if (connection) {
         try {
            await connection.close();
         } catch (err) {
            console.error("Error closing connection:", err);
         }
      }
   }
}

module.exports = { queryTable };
