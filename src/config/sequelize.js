const { Sequelize } = require("sequelize");

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&project=${ENDPOINT_ID}`;

const sequelize = new Sequelize(connectionString);

async function authSequelize() {
   try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
   } catch (error) {
      console.error("Unable to connect to the database:", error);
   }
}

module.exports = { sequelize, authSequelize };
