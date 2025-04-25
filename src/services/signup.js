const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { User } = require("../models/index");

userExists = async (email, regNo) => {
   try {
      const user = await User.findOne({
         where: {
            [Op.or]: [{ email: email }, { id: regNo }],
         },
         raw: true,
      });
      return user;
   } catch (error) {
      console.error("Error checking user existence:", error);
      throw error;
   }
};

createUser = async (userData) => {
   try {
      const user = await User.create({
         id: userData.regNo,
         name: userData.name,
         email: userData.email,
         phone: userData.phone,
         password: await bcrypt.hash(userData.password, 10),
         user_type: userData.user_type,
      });
      return user;
   } catch (error) {
      console.error("Error creating user:", error);
      throw error;
   }
};

module.exports = {
   userExists,
   createUser,
};
