const crypto = require("crypto");

const generateUniqueString = (length) => {
   if (length <= 0) {
      throw new Error("Length must be a positive integer");
   }

   const bytes = crypto.randomBytes(Math.ceil(length / 2));
   const uniqueString = bytes.toString("hex").slice(0, length);
   return uniqueString;
};

const getVenueID = async (venue) => {
   const { Venue } = require("../models/index");

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

   let newVenue = null;
   if (!result) {
      newVenue = await Venue.create({
         name,
         location,
      });
   }

   return (result || newVenue).id;
};

module.exports = {
   generateUniqueString,
   getVenueID,
};
