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
const { USERTYPE, VERIFIEDSTATUS } = require("../utils/enumObj");
const {
   getVenue,
   checkEventClosed,
   getRegistrationData,
} = require("../utils/userUtils");

exports.verifyOTP = async (req, res) => {
   if (req.user.verified_status === VERIFIEDSTATUS.BOTH_VERIFIED) {
      return res.redirect("/home");
   }
   res.render("verifyOTP", {
      status: req.user.verified_status,
      email: req.user.email,
      phone: req.user.phone,
      user: req.user.user_type,
   });
};

exports.dashboard = (req, res) => {
   res.render("dashboard", {
      ID: req.user.id,
      user: req.user.user_type,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
   });
};

exports.find = async (req, res) => {
   res.render("findEvents", {
      user: req.user.user_type,
      events: await sqlGetFindEvents(),
   });
};

exports.manage = async (req, res) => {
   let events;
   if (req.user.user_type === USERTYPE.ATTENDEE) {
      events = await sqlGetAttendeeUpcommingEvents(req.user.id);
   } else {
      events = await sqlGetOrganizerUpcommingEvents(req.user.id);
   }
   res.render("manageEvents", {
      user: req.user.user_type,
      events,
   });
};

exports.history = async (req, res) => {
   let events;
   if (req.user.user_type === USERTYPE.ATTENDEE) {
      events = await sqlGetAttendeePreviousEvents(req.user.id);
   } else {
      events = await sqlGetOrganizerPreviousEvents(req.user.id);
   }
   res.render("history", {
      user: req.user.user_type,
      events,
   });
};

exports.create = async (req, res) => {
   res.render("createEvent", {
      user: req.user.user_type,
      eventTypes: await sqlGetEventTypes(),
   });
};

exports.eventID = async (req, res) => {
   const event = await sqlGetEventDetails(req.params.id);
   res.render("eventCard", {
      user: req.user.user_type,
      attendeeID: req.user.id,
      event,
      eventType: await sqlGetEventType(event.event_type_id),
      eventTypes: await sqlGetEventTypes(),
      venue: await getVenue(event.venue_id),
      eventClosed: checkEventClosed(event.registration_deadline),
      status: await sqlGetRegistrationStatus(req.params.id, req.user.id),
   });
};

exports.viewID = async (req, res) => {
   const event = await sqlGetEventDetails(req.params.id);
   const registrationsData = await getRegistrationData(req.params.id);
   res.render("viewRegistrations", {
      user: req.user.user_type,
      event,
      registrationsData,
   });
};
