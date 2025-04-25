const convertToIST = (req, res, next) => {
   const fieldsToConvert = ["start_time", "end_time", "registration_deadline"];

   fieldsToConvert.forEach((field) => {
      const date = req.body[field];
      if (date) {
         const utcDate = new Date(date);
         if (!isNaN(utcDate)) {
            const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);
            req.body[field] = istDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
         } else {
            console.warn(`Invalid date for field "${field}":`, date);
         }
      }
   });

   return next();
};

module.exports = convertToIST;
