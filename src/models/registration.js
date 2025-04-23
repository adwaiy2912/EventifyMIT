const { PAYMENT_STATUS } = require("../utils/constants");

module.exports = (sequelize, DataTypes) => {
   const Registration = sequelize.define("registration", {
      event_id: {
         type: DataTypes.CHAR(10),
         primaryKey: true,
         allowNull: false,
      },
      attendee_id: {
         type: DataTypes.BIGINT,
         primaryKey: true,
         allowNull: false,
      },
      registration_date: {
         type: DataTypes.DATE,
         allowNull: false,
      },
      payment_status: {
         type: DataTypes.ENUM,
         values: Object.values(PAYMENT_STATUS),
         allowNull: false,
      },
   });

   Registration.associate = (models) => {
      Registration.belongsTo(models.event, {
         foreignKey: "event_id",
         targetKey: "event_id",
      });
      Registration.belongsTo(models.user, {
         foreignKey: "attendee_id",
         targetKey: "id",
      });
   };

   return Registration;
};
