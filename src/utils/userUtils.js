const crypto = require("crypto");
const { sqlGetVenueID } = require("../models/userModels");

getUserType = (user) =>
   user.attendee_id === undefined ? "ORGANIZER" : "ATTENDEE";

generateUniqueString = (length) => {
   if (length <= 0) {
      throw new Error("Length must be a positive integer");
   }

   const bytes = crypto.randomBytes(Math.ceil(length / 2));
   const uniqueString = bytes.toString("hex").slice(0, length);
   return uniqueString;
};

getVenueID = async (venue) => {
   let result;
   venue = venue.toUpperCase();
   if (venue.includes("ACADEMIC BLOCK")) {
      const lastSpaceIndex = venue.lastIndexOf(" ");

      const name = venue.substring(0, lastSpaceIndex);
      const location = venue.substring(lastSpaceIndex + 1);

      result = await sqlGetVenueID(name, location);
   } else {
      result = await sqlGetVenueID(venue, venue);
   }
   return result.rows[0].venue_id;
};

module.exports = {
   getUserType,
   generateUniqueString,
   getVenueID,
};
