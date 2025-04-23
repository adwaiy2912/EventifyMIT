module.exports = (sequelize, DataTypes) => {
   const EventType = sequelize.define("event_type", {
      id: {
         type: DataTypes.CHAR(5),
         primaryKey: true,
         allowNull: false,
      },
      name: {
         type: DataTypes.STRING(50),
         allowNull: false,
      },
   });

   EventType.associate = (models) => {
      EventType.hasMany(models.event, {
         foreignKey: "event_type_id",
         sourceKey: "id",
      });
   };

   return EventType;
};
