module.exports = (sequelize, DataTypes) => {
   const OTP = sequelize.define(
      "otp",
      {
         email: {
            type: DataTypes.STRING(100),
            primaryKey: true,
         },
         phone: {
            type: DataTypes.BIGINT,
            primaryKey: true,
         },
         otp_code: {
            type: DataTypes.STRING(60),
            allowNull: false,
         },
         created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
         },
         expires_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal(
               "CURRENT_TIMESTAMP + INTERVAL '30 minutes'"
            ),
         },
      },
      {
         tableName: "otp",
         timestamps: false,
      }
   );

   OTP.associate = (models) => {
      OTP.belongsTo(models.user, {
         foreignKey: "email",
         targetKey: "email",
      });
      OTP.belongsTo(models.user, {
         foreignKey: "phone",
         targetKey: "phone",
      });
   };

   return OTP;
};
