const validator = require("validator");

loginValidator = (data) => {
   const { email, password } = data;

   if (!email) return "Email is required";
   if (!password) return "Password is required";

   return null;
};

signupValidator = (data) => {
   const { name, regNo, email, phone, password, confirmPassword } = data;

   if (!name) return "Name is required";
   if (!regNo) return "Registration number is required";
   if (!email) return "Email is required";
   if (!phone) return "Phone number is required";
   if (!password) return "Password is required";
   if (!confirmPassword) return "Confirm password is required";

   if (!validator.isAlpha(name.replace(/\s/g, "")))
      return "Name must be alphabetic";
   if (!validator.isNumeric(regNo))
      return "Registration number must be numeric";
   if (!validator.isEmail(email)) return "Invalid email";
   if (!validator.isMobilePhone(phone)) return "Invalid phone number";
   if (!validator.isStrongPassword(password))
      return "Password must contain at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol";

   if (!validator.equals(password, confirmPassword))
      return "Passwords do not match";

   return null;
};

createValidator = (data) => {
   const { name, description, date, time, venue, deadline, fee, eventType } =
      data;

   if (!name) return "Name is required";
   if (!description) return "Description is required";
   if (!date) return "Date is required";
   if (!time) return "Time is required";
   if (!venue) return "Venue is required";
   if (!deadline) return "Deadline is required";
   if (!fee) return "Fee is required";
   if (!eventType) return "Event type is required";

   if (!validator.isDate(date) || new Date(date) < new Date())
      return "Invalid date";
   if (!validator.isTime(time)) return "Invalid time";
   if (!validator.isDate(deadline) || new Date(deadline) < new Date())
      return "Invalid deadline";
   if (!validator.isNumeric(fee)) return "Fee must be numeric";

   if (new Date(date) < new Date(deadline))
      return "Deadline must be before the event date";

   return null;
};

module.exports = { loginValidator, signupValidator, createValidator };
