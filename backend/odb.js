const oracledb = require("oracledb");

async function queryTable() {
   let connection;

   try {
      // Establish connection to the database
      connection = await oracledb.getConnection({
         user: "SYSTEM",
         password: "tiger",
         connectString: "tcp://0.tcp.in.ngrok.io:19028/XEPDB1",
      });

      // Query the table
      const result = await connection.execute("SELECT * FROM SKILL");

      // Return the result
      return result.rows;
   } catch (err) {
      console.error("Error querying table:", err);
      throw err; // Re-throw the error to propagate it
   } finally {
      // Release the connection
      if (connection) {
         try {
            await connection.close();
         } catch (err) {
            console.error("Error closing connection:", err);
         }
      }
   }
}

// Call the function and handle the result
queryTable()
   .then((rows) => {
      console.log("Query result:", rows);
      // Handle the result here
   })
   .catch((err) => {
      // Handle errors here
   });

module.exports = {
   queryTable: queryTable,
};
