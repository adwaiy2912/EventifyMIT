const crypto = require("crypto");
const {
   sqlGetVenueID,
   sqlGetEventRegistrations,
   sqlGetAttendeeData,
} = require("../models/organizerGetModels");
const { sqlGetVenue } = require("../models/userGetModels");

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

getVenue = async (venueID) => {
   const result = await sqlGetVenue(venueID);
   if (result.name === result.location) {
      return result.name;
   }
   return `${result.name} ${result.location}`;
};

checkEventClosed = (registerDeadline) => {
   const currentDate = new Date();
   const registerDate = new Date(registerDeadline);
   return currentDate > registerDate;
};

getRegistrationData = async (eventID) => {
   const registrations = await sqlGetEventRegistrations(eventID);
   const attendeeIDs = registrations.map(
      (registration) => registration.attendee_id
   );
   const attendeeData = await sqlGetAttendeeData(attendeeIDs);

   const attendeeMap = attendeeData.reduce((map, attendee) => {
      map[attendee.attendee_id] = attendee;
      return map;
   }, {});

   return registrations.map((event) => {
      return {
         ...event,
         ...attendeeMap[event.attendee_id],
      };
   });
};

module.exports = {
   getTable,
   generateUniqueString,
   getVenueID,
   getVenue,
   checkEventClosed,
   getRegistrationData,
};
