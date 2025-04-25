module.exports = (sequelize, DataTypes) => {
   const Venue = sequelize.define(
      "venue",
      {
         id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
         },
         name: {
            type: DataTypes.STRING(50),
            allowNull: false,
         },
         location: {
            type: DataTypes.STRING(50),
            allowNull: false,
         },
      },
      {
         indexes: [
            {
               unique: true,
               fields: ["name", "location"],
            },
         ],
      }
   );

   Venue.associate = (models) => {
      Venue.hasMany(models.Event, {
         foreignKey: "venue_id",
         sourceKey: "id",
      });
   };

   return Venue;
};
