const { Event, EventType, Venue } = require("../models/index");

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

const { USER_TYPE, VERIFIED_STATUS } = require("../utils/constants");

exports.verifyOTP = async (req, res) => {
   if (req.user.verified_status === VERIFIED_STATUS.BOTH_VERIFIED) {
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
   const events = await findAllEvents();

   res.render("findEvents", {
      user: req.user.user_type,
      events,
   });
};

exports.manage = async (req, res) => {
   const events =
      req.user.user_type === USER_TYPE.ATTENDEE
         ? await manageAttendeeUpcomingEvents(req.user.id)
         : await manageOrganizerUpcomingEvents(req.user.id);

   res.render("manageEvents", {
      user: req.user.user_type,
      events,
   });
};

exports.history = async (req, res) => {
   const events =
      req.user.user_type === USER_TYPE.ATTENDEE
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
      eventTypes: await EventType.findAll({ raw: true }),
   });
};

exports.eventID = async (req, res) => {
   const event = await Event.findByPk(req.params.id, { raw: true });
   if (!event) {
      return res
         .status(404)
         .json({ message: "Event not found", redirectUrl: "/home" });
   }

   res.render("eventCard", {
      user: req.user.user_type,
      attendeeID: req.user.id,
      event,
      eventType: await EventType.findByPk(event.event_type_id, { raw: true }),
      eventTypes: await EventType.findAll({}),
      venue: await Venue.findByPk(event.venue_id, { raw: true }),
      eventClosed: event.registration_deadline < new Date(),
      status: await eventRegistrationStatus(req.params.id, req.user.id),
   });
};

exports.viewID = async (req, res) => {
   const event = await Event.findByPk(req.params.id);
   if (!event) {
      return res.status(404).json({
         message: "Event not found",
         redirectUrl: "/home",
      });
   }
   const registrationsData = await viewEventRegistrations(req.params.id);

   res.render("viewRegistrations", {
      user: req.user.user_type,
      event,
      registrationsData,
   });
};
