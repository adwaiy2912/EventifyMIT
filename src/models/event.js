const { generateUniqueString } = require("../utils/helper");

module.exports = (sequelize, DataTypes) => {
   const Event = sequelize.define(
      "event",
      {
         event_id: {
            type: DataTypes.CHAR(10),
            primaryKey: true,
            allowNull: false,
            defaultValue: () => generateUniqueString(10),
         },
         event_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
         },
         event_description: {
            type: DataTypes.STRING(500),
            allowNull: false,
         },
         event_type_id: {
            type: DataTypes.CHAR(5),
            allowNull: false,
         },
         venue_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         organizer_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
         },
         start_time: {
            type: DataTypes.DATE,
            allowNull: false,
         },
         end_time: {
            type: DataTypes.DATE,
            allowNull: false,
         },
         registration_deadline: {
            type: DataTypes.DATE,
            allowNull: false,
         },
         fees: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
         },
      },
      {
         indexes: [
            {
               unique: true,
               fields: ["event_name", "start_time"],
            },
         ],
      }
   );

   Event.associate = (models) => {
      Event.belongsTo(models.User, {
         foreignKey: "organizer_id",
         targetKey: "id",
         as: "organizer",
      });
      Event.belongsTo(models.Venue, {
         foreignKey: "venue_id",
         targetKey: "id",
      });
      Event.belongsTo(models.EventType, {
         foreignKey: "event_type_id",
         targetKey: "id",
      });
      Event.hasMany(models.Registration, {
         foreignKey: "event_id",
         sourceKey: "event_id",
         as: "registrations",
      });
   };

   return Event;
};
