const {
   sqlCheckForExistUser,
   sqlInsertIntoTable,
} = require("../models/signup");

exports.signup = async (req, res) => {
   try {
      // const userCheck = users.find((user) => user.email === req.body.email);
      console.log(req.body);
      const userCheck = await sqlCheckForExistUser(req.body.email);
      if (!userCheck) {
         console.log("user exists");
         return res.status(400).redirect("/user");
      }
      if (req.body.password !== req.body.confirmPassword) {
         console.log("user pass wrong");
         return res.status(403).redirect("/user");
      }
      await sqlInsertIntoTable(req.body);
      console.log("user created");
      return res.status(200).redirect("/home");
   } catch {
      console.log("error occured");
      return res.status(500).redirect("/user");
   }
};
