const { Event } = require("../models/event");
const { EventType } = require("../models/eventType");
const { Venue } = require("../models/venue");

const { findAllEvents } = require("../services/find");
const {
   manageAttendeeUpcomingEvents,
   manageOrganizerUpcomingEvents,
} = require("../services/manage");
const {
   historyAttendeePreviousEvents,
   historyOrganizerPreviousEvents,
} = require("../services/history");
const { eventRegistrationStatus } = require("../services/event");
const { viewEventRegistrations } = require("../services/view");

const { USERTYPE, VERIFIEDSTATUS } = require("../utils/constants");
const { checkEventClosed } = require("../utils/helper");

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
   const events = findAllEvents();

   res.render("findEvents", {
      user: req.user.user_type,
      events,
   });
};

exports.manage = async (req, res) => {
   const events =
      req.user.user_type === USERTYPE.ATTENDEE
         ? await manageAttendeeUpcomingEvents(req.user.id)
         : await manageOrganizerUpcomingEvents(req.user.id);

   res.render("manageEvents", {
      user: req.user.user_type,
      events,
   });
};

exports.history = async (req, res) => {
   const events =
      req.user.user_type === USERTYPE.ATTENDEE
         ? await historyAttendeePreviousEvents(req.user.id)
         : await historyOrganizerPreviousEvents(req.user.id);

   res.render("history", {
      user: req.user.user_type,
      events,
   });
};

exports.create = async (req, res) => {
   res.render("createEvent", {
      user: req.user.user_type,
      eventTypes: await EventType.findAll({}),
   });
};

exports.eventID = async (req, res) => {
   const event = await Event.findByPk(req.params.id);
   if (!event) {
      return res.status(404).send("Event not found");
   }

   res.render("eventCard", {
      user: req.user.user_type,
      attendeeID: req.user.id,
      event,
      eventType: await EventType.findByPk(event.event_type_id),
      eventTypes: await EventType.findAll({}),
      venue: await Venue.findByPk(event.venue_id),
      eventClosed: checkEventClosed(event.registration_deadline),
      status: await eventRegistrationStatus(req.params.id, req.user.id),
   });
};

exports.viewID = async (req, res) => {
   const event = await Event.findByPk(req.params.id);
   if (!event) {
      return res.status(404).send("Event not found");
   }
   const registrationsData = await viewEventRegistrations(req.params.id);

   res.render("viewRegistrations", {
      user: req.user.user_type,
      event,
      registrationsData,
   });
};
