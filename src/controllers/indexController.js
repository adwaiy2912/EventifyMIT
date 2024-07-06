const {
   sqlGetAttendeeUpcommingEvents,
   sqlGetAttendeePreviousEvents,
} = require("../models/attendeeGetModels");
const {
   sqlGetOrganizerUpcommingEvents,
   sqlGetOrganizerPreviousEvents,
} = require("../models/organizerGetModels");
const {
   sqlGetEventTypes,
   sqlGetEventDetails,
   sqlGetEventType,
   sqlGetFindEvents,
   sqlGetRegistrationStatus,
} = require("../models/userGetModels");
const {
   getUserType,
   getVenue,
   checkEventClosed,
   getRegistrationData,
} = require("../utils/userUtils");

exports.verifyOTP = async (req, res) => {
   if (req.user.verified_status === "BOTH_VERIFIED") {
      return res.redirect("/home");
   }
   res.render("verifyOTP", {
      status: req.user.verified_status,
      email: req.user.email,
      phone: req.user.phone,
      user: getUserType(req.user),
   });
};

exports.dashboard = (req, res) => {
   res.render("dashboard", {
      ID: req.user.attendee_id || req.user.organizer_id,
      user: getUserType(req.user),
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
   });
};

exports.find = async (req, res) => {
   res.render("findEvents", {
      user: getUserType(req.user),
      events: await sqlGetFindEvents(),
   });
};

exports.manage = async (req, res) => {
   const user = getUserType(req.user);
   let events;
   if (user === "ATTENDEE") {
      events = await sqlGetAttendeeUpcommingEvents(req.user.attendee_id);
   } else {
      events = await sqlGetOrganizerUpcommingEvents(req.user.organizer_id);
   }
   res.render("manageEvents", {
      user,
      events,
   });
};

exports.history = async (req, res) => {
   const user = getUserType(req.user);
   let events;
   if (user === "ATTENDEE") {
      events = await sqlGetAttendeePreviousEvents(req.user.attendee_id);
   } else {
      events = await sqlGetOrganizerPreviousEvents(req.user.organizer_id);
   }
   res.render("history", {
      user,
      events,
   });
};

exports.create = async (req, res) => {
   res.render("createEvent", {
      user: getUserType(req.user),
      eventTypes: await sqlGetEventTypes(),
   });
};

exports.eventID = async (req, res) => {
   const event = await sqlGetEventDetails(req.params.id);
   res.render("eventCard", {
      user: getUserType(req.user),
      attendeeID: req.user.attendee_id,
      event,
      eventType: await sqlGetEventType(event.event_type_id),
      eventTypes: await sqlGetEventTypes(),
      venue: await getVenue(event.venue_id),
      eventClosed: checkEventClosed(event.registration_deadline),
      status: await sqlGetRegistrationStatus(
         req.params.id,
         req.user.attendee_id
      ),
   });
};

exports.viewID = async (req, res) => {
   const event = await sqlGetEventDetails(req.params.id);
   const registrationsData = await getRegistrationData(req.params.id);
   res.render("viewRegistrations", {
      user: getUserType(req.user),
      event,
      registrationsData,
   });
};
