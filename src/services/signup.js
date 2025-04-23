const { bcrypt } = require("bcrypt");
const { User } = require("../models/index");

userExists = async (email, regNo) => {
   try {
      const user = await User.findOne({
         where: {
            [User.sequelize.Op.or]: [{ email: email }, { id: regNo }],
         },
      });
      return user !== null;
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
         user_type: userData.USER_TYPE,
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
