const express = require("express");
const oracledb = require("oracledb");
const app = express();

app.get("/", async (req, res) => {
   try {
      const result = await queryTable();
      res.json(result);
   } catch (err) {
      console.error("Error querying table:", err);
      res.status(500).json({ error: "Error querying table" });
   }
});

async function queryTable() {
   let connection;
   try {
      // connection = await oracledb.getConnection({
      //     user: "SYSTEM",
      //     password: "tiger",
      //     connectString: "localhost:1521/XEPDB1",
      // });
      connection = await oracledb.getConnection({
         user: "SYSTEM",
         password: "tiger",
         connectString: "tcp://0.tcp.in.ngrok.io:17417/XEPDB1",
      });

      const queryOrganizers = "SELECT * FROM ORGANIZERS";
      const queryAttendees = "SELECT * FROM ATTENDEES";
      const queryEventTypes = "SELECT * FROM EVENT_TYPES";
      const queryVenue = "SELECT * FROM VENUE";
      const queryPaymentStatuses = "SELECT * FROM PAYMENT_STATUSES";
      const queryEvents = "SELECT * FROM EVENTS";
      const queryTakesPlace = "SELECT * FROM TAKES_PLACE";

      const resultOrganizers = await connection.execute(queryOrganizers);
      const resultAttendees = await connection.execute(queryAttendees);
      const resultEventTypes = await connection.execute(queryEventTypes);
      const resultVenue = await connection.execute(queryVenue);
      const resultPaymentStatuses = await connection.execute(
         queryPaymentStatuses
      );
      const resultEvents = await connection.execute(queryEvents);
      const resultTakesPlace = await connection.execute(queryTakesPlace);

      const response = {
         organizers: resultOrganizers.rows,
         attendees: resultAttendees.rows,
         eventTypes: resultEventTypes.rows,
         venue: resultVenue.rows,
         paymentStatuses: resultPaymentStatuses.rows,
         events: resultEvents.rows,
         takesPlace: resultTakesPlace.rows,
      };

      return response;
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
