module.exports = (sequelize, DataTypes) => {
   const OTP = sequelize.define(
      "otp",
      {
         id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         email: {
            type: DataTypes.STRING(100),
            allowNull: true,
         },
         phone: {
            type: DataTypes.BIGINT,
            allowNull: true,
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
         validate: {
            emailOrPhoneProvided() {
               if (!this.email && !this.phone) {
                  throw new Error("Either email or phone must be provided.");
               }
            },
         },
         indexes: [
            {
               unique: true,
               fields: ["email", "phone"],
            },
         ],
      }
   );

   OTP.associate = (models) => {
      OTP.belongsTo(models.User, {
         foreignKey: "email",
         targetKey: "email",
      });
      OTP.belongsTo(models.User, {
         foreignKey: "phone",
         targetKey: "phone",
      });
   };

   return OTP;
};
