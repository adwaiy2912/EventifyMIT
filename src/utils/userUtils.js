getUserType = (user) =>
   user.attendee_id === undefined ? "ORGANIZER" : "ATTENDEE";

module.exports = {
   getUserType,
};
