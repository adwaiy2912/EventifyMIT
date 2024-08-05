const Pool = require("pg").Pool;

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&project=${ENDPOINT_ID}`;

const pool = new Pool({
   connectionString: connectionString,
});

async function getPgVersion() {
   pool.query("select version()", (err, res) => {
      if (!err) {
         console.log("PostgreSQL version: ", res.rows[0].version);
      } else {
         console.log("Error: ", err);
      }
   });
}

module.exports = { pool, getPgVersion };
