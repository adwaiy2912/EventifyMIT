const { Sequelize } = require("sequelize");

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&project=${ENDPOINT_ID}`;

const sequelize = new Sequelize(connectionString, {
   logging: false,
});

module.exports = sequelize;
