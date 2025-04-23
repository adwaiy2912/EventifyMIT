const crypto = require("crypto");
const {
   sqlGetVenueID,
   sqlGetEventRegistrations,
   sqlGetAttendeeData,
} = require("../models/organizerGetModels");
const { sqlGetVenue } = require("../models/userGetModels");

const { Venue } = require("../models/venue");

generateUniqueString = (length) => {
   if (length <= 0) {
      throw new Error("Length must be a positive integer");
   }

   const bytes = crypto.randomBytes(Math.ceil(length / 2));
   const uniqueString = bytes.toString("hex").slice(0, length);
   return uniqueString;
};

getTable = (userType) => {
   switch (userType) {
      case "organizer":
         return "ORGANIZERS";
      case "attendee":
         return "ATTENDEES";
      default:
         throw new Error("Invalid user type");
   }
};

const getVenueID = async (venue) => {
   venue = venue.toUpperCase();
   let name, location;

   if (venue.includes("ACADEMIC BLOCK")) {
      const lastSpaceIndex = venue.lastIndexOf(" ");
      name = venue.substring(0, lastSpaceIndex);
      location = venue.substring(lastSpaceIndex + 1);
   } else {
      name = location = venue;
   }

   const result = await Venue.findOne({
      where: {
         name,
         location,
      },
   });

   if (!result) {
      throw new Error(
         `Venue not found for name: ${name}, location: ${location}`
      );
   }

   return result.venue_id;
};

module.exports = {
   getTable,
   generateUniqueString,
   getVenueID,
};
