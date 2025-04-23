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
      User.hasMany(models.otp, {
         foreignKey: "email",
         sourceKey: "email",
      });
      User.hasMany(models.otp, {
         foreignKey: "phone",
         sourceKey: "phone",
      });
      User.hasMany(models.event, {
         foreignKey: "organizer_id",
         sourceKey: "id",
      });
      User.hasMany(models.registration, {
         foreignKey: "attendee_id",
         sourceKey: "id",
      });
   };

   return User;
};
