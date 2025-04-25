const {
   sequelize,
   User,
   Event,
   Venue,
   EventType,
   Registration,
   OTP,
} = require("../models/index");

const syncSequelize = async () => {
   try {
      await sequelize.authenticate();
      console.log("🛠️ Sequelize connection established.");

      await Promise.all([
         User.sync({ alter: true }),
         Event.sync({ alter: true }),
         Venue.sync({ alter: true }),
         EventType.sync({ alter: true }),
         Registration.sync({ alter: true }),
         OTP.sync({ alter: true }),
      ]);

      console.log("📊 Database & tables created!");

      // await printTopRows();
   } catch (error) {
      console.error("Error during syncSequelize:", error);
   }
};

const printTopRows = async () => {
   try {
      const tables = { User, Event, Venue, EventType, Registration, OTP };

      for (const [name, model] of Object.entries(tables)) {
         const rows = await model.findAll({ limit: 5 });
         console.log(`\n📋 Top 5 rows from ${name}:`);
         console.table(rows.map((row) => row.get({ plain: true })));
      }
   } catch (error) {
      console.error("Error printing table rows:", error);
   }
};

module.exports = { syncSequelize };
