const { VERIFIED_STATUS, USER_TYPE } = require("../utils/constants");

module.exports = (sequelize, DataTypes) => {
   const User = sequelize.define("user", {
      id: {
         type: DataTypes.BIGINT,
         primaryKey: true,
         allowNull: false,
      },
      name: {
         type: DataTypes.STRING(50),
         allowNull: false,
      },
      email: {
         type: DataTypes.STRING(100),
         allowNull: false,
         unique: true,
      },
      password: {
         type: DataTypes.STRING(60),
         allowNull: false,
      },
      phone: {
         type: DataTypes.BIGINT,
         allowNull: false,
         unique: true,
      },
      verified_status: {
         type: DataTypes.ENUM,
         values: Object.values(VERIFIED_STATUS),
         // defaultValue: VERIFIED_STATUS.UNVERIFIED,
         defaultValue: VERIFIED_STATUS.PHONE_VERIFIED,
         allowNull: false,
      },
      user_type: {
         type: DataTypes.ENUM,
         values: Object.values(USER_TYPE),
         allowNull: false,
      },
   });

   User.associate = (models) => {
      User.hasMany(models.OTP, {
         foreignKey: "email",
         sourceKey: "email",
      });
      User.hasMany(models.OTP, {
         foreignKey: "phone",
         sourceKey: "phone",
      });
      // Events organized by this user (as organizer)
      User.hasMany(models.Event, {
         foreignKey: "organizer_id",
         sourceKey: "id",
         as: "organizedEvents",
      });
      // Registrations made by this user (as attendee)
      User.hasMany(models.Registration, {
         foreignKey: "attendee_id",
         sourceKey: "id",
         as: "registrations",
      });
   };

   return User;
};
