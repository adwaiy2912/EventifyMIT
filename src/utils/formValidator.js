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
   const {
      name,
      description,
      start_date,
      start_time,
      end_date,
      end_time,
      venue,
      deadline_date,
      deadline_time,
      fee,
      event_type_id,
   } = data;

   if (!name) return "Name is required";
   if (!description) return "Description is required";
   if (!start_date) return "Start date is required";
   if (!start_time) return "Start time is required";
   if (!end_date) return "End date is required";
   if (!end_time) return "End time is required";
   if (!venue) return "Venue is required";
   if (!deadline_date) return "Deadline date is required";
   if (!deadline_time) return "Deadline time is required";
   if (!fee) return "Fee is required";
   if (!event_type_id) return "Event type is required";

   if (!validator.isDate(start_date) || new Date(start_date) < new Date())
      return "Invalid start date";
   if (!validator.isTime(start_time)) return "Invalid start time";
   if (!validator.isDate(end_date) || new Date(end_date) < new Date())
      return "Invalid end date";
   if (!validator.isTime(end_time)) return "Invalid end time";
   if (!validator.isDate(deadline_date) || new Date(deadline_date) < new Date())
      return "Invalid deadline date";
   if (!validator.isTime(deadline_time)) return "Invalid deadline time";
   if (!validator.isNumeric(fee)) return "Fee must be numeric";

   if (new Date(start_date) > new Date(end_date))
      return "Start date must be before end date";
   if (new Date(start_date) < new Date(deadline_date))
      return "Start date must be after deadline date";

   return null;
};

module.exports = { loginValidator, signupValidator, createValidator };
