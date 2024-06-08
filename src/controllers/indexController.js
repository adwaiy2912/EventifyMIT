const {
   checkAuthenticated,
   checkNotAuthenticated,
   checkForAttendee,
   checkForOrganizer,
} = require("../middleware/authMiddleware");
const { sqlFindEvents, sqlEventTypes } = require("../models/indexModels");
const {
   sqlGetEventDetails,
   sqlGetEventType,
   sqlGetRegistrationStatus,
   sqlGetOrganizerUpcommingEvents,
   sqlGetAttendeeUpcommingEvents,
   sqlGetOrganizerPreviousEvents,
   sqlGetAttendeePreviousEvents,
} = require("../models/userGetModels");
const { getUserType, getVenue } = require("../utils/userUtils");

exports.dashboard =
   (checkAuthenticated,
   (req, res) => {
      res.render("dashboard", {
         ID: req.user.attendee_id || req.user.organizer_id,
         user: getUserType(req.user),
         name: req.user.name,
         email: req.user.email,
         phone: req.user.phone,
      });
   });

exports.find =
   (checkAuthenticated,
   checkForAttendee,
   async (req, res) => {
      res.render("find", {
         user: getUserType(req.user),
         events: await sqlFindEvents(),
      });
   });

exports.manage =
   (checkAuthenticated,
   async (req, res) => {
      const user = getUserType(req.user);
      let events;
      if (user === "ATTENDEE") {
         events = await sqlGetAttendeeUpcommingEvents(req.user.attendee_id);
      } else {
         events = await sqlGetOrganizerUpcommingEvents(req.user.organizer_id);
      }
      res.render("manage", {
         user,
         events,
      });
   });

exports.history =
   (checkAuthenticated,
   async (req, res) => {
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
   });

exports.create =
   (checkAuthenticated,
   checkForOrganizer,
   async (req, res) => {
      res.render("create", {
         user: getUserType(req.user),
         eventTypes: await sqlEventTypes(),
      });
   });

exports.find_ID =
   (checkAuthenticated,
   checkForAttendee,
   async (req, res) => {
      const event = await sqlGetEventDetails(req.params.id);
      res.render("event", {
         user: getUserType(req.user),
         attendeeID: req.user.attendee_id,
         event,
         eventType: await sqlGetEventType(event.event_type_id),
         venue: await getVenue(event.venue_id),
         status: await sqlGetRegistrationStatus(
            req.params.id,
            req.user.attendee_id
         ),
      });
   });
