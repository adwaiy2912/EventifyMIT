const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const localStrategy = require("passport-local").Strategy;
require("dotenv").config();
const oracledb = require("oracledb");
const crypto = require("crypto");

const eventData = require("./eventData.js");

const dbConfig = {
   user: "SYSTEM",
   password: "tiger",
   connectString: "tcp://0.tcp.in.ngrok.io:14527/XEPDB1",
};

passport.use(
   "local-login",
   new localStrategy(
      {
         usernameField: "email",
         passwordField: "password",
         passReqToCallback: true,
      },
      async (req, email, password, done) => {
         try {
            // const user = users.find((user) => user.email === email);
            const connection = await oracledb.getConnection(dbConfig);
            const result = await connection.execute(
               `SELECT * FROM attendee_organizer_combined WHERE EMAIL = :email`,
               [email]
            );
            await connection.close();

            if (result.rows.length === 0) {
               return done(null, false, { message: "No user with that email" });
            }

            const user = result.rows[0];
            // password on 4th index; if not work -> prob. view changed
            const isPasswordMatch = await bcrypt.compare(password, user[3]);
            if (!isPasswordMatch) {
               return done(null, false, { message: "Password incorrect" });
            }

            return done(null, user);
         } catch (error) {
            return done(error);
         }
      }
   )
);
passport.serializeUser((user, done) => {
   // done(null, user.email);
   done(null, user[2]);
});
passport.deserializeUser(async (email, done) => {
   // const user = users.find((user) => user.email === email);
   try {
      const connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(
         `SELECT * FROM attendee_organizer_combined WHERE EMAIL = :email`,
         [email]
      );
      await connection.close();

      if (result.rows.length === 0) {
         return done(new Error("User not found"));
      }
      const user = result.rows[0];
      // return done(null, user);
      return done(null, user);
   } catch (error) {
      return done(error);
   }
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
   session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
   })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "ejs");

app.delete("/logout", (req, res, next) => {
   req.logOut((err) => {
      if (err) {
         return next(err);
      }
      res.redirect("/");
   });
});
checkAuthenticated = (req, res, next) => {
   if (req.isAuthenticated()) {
      return next();
   }

   res.redirect("/");
};
checkNotAuthenticated = (req, res, next) => {
   if (req.isAuthenticated()) {
      return res.redirect("/home");
   }
   next();
};
checkForOrganizer = (req, res, next) => {
   if (req.user[6] === "ORGANIZER") {
      return next();
   }
   res.redirect("/home");
};
checkForAttendee = (req, res, next) => {
   if (req.user[6] === "ATTENDEE") {
      return next();
   }
   res.redirect("/home");
};

app.get("/", checkNotAuthenticated, (req, res) => {
   res.render("root", {});
});
app.get("/home", checkAuthenticated, (req, res) => {
   res.render("home", { user: req.user[6] });
});
app.get("/user", checkNotAuthenticated, (req, res) => {
   res.render("user", {});
});
app.get("/dashboard", checkAuthenticated, (req, res) => {
   res.render("dashboard", {
      user: req.user[6],
      name: req.user[1],
      email: req.user[2],
      phone: req.user[4],
      loc: req.user[5],
   });
});
app.get("/find", checkAuthenticated, checkForAttendee, (req, res) => {
   res.render("find", { user: req.user[6] });
});
app.get("/create", checkAuthenticated, checkForOrganizer, (req, res) => {
   res.render("create", { user: req.user[6] });
});
app.get("/manage", checkAuthenticated, (req, res) => {
   res.render("manage", { user: req.user[6] });
});
app.get("/history", checkAuthenticated, (req, res) => {
   res.render("history", { user: req.user[6] });
});

generateUniqueKey = (email, length) => {
   const hash = crypto.createHash("sha256");
   hash.update(email);
   const hashedEmail = hash.digest("hex");
   const decimalString = BigInt(`0x${hashedEmail}`).toString();
   const key = decimalString.slice(0, length).padStart(length, "0");
   return key;
};

sqlCheckForExistUser = async (email) => {
   try {
      const connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(
         `SELECT * FROM attendee_organizer_combined WHERE EMAIL = :email`,
         [email]
      );

      await connection.close();
      if (result.rows.length === 0) {
         return "notExist";
      } else {
         return;
      }
   } catch (error) {
      console.error(error);
      throw error;
   }
};
sqlInsertIntoTable = async (data) => {
   try {
      const table =
         data.type === "organizer"
            ? "ORGANIZERS"
            : data.type === "attendee"
            ? "ATTENDEES"
            : "";
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const key = await generateUniqueKey(data.email, 20);
      const connection = await oracledb.getConnection(dbConfig);

      await connection.execute(
         `INSERT INTO ${table} (ID, NAME, EMAIL, PHONE, PASSWORD) VALUES (:id, :name, :email, :phone, :password)`,
         {
            id: key,
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
         }
      );
      await connection.commit();
      await connection.close();
   } catch (error) {
      console.error(error);
      throw error;
   }
};
app.post("/user/signup", async (req, res) => {
   try {
      // const userCheck = users.find((user) => user.email === req.body.email);
      const userCheck = await sqlCheckForExistUser(req.body.email);
      if (!userCheck) {
         console.log("user exists");
         return res.status(400).redirect("/user");
      }
      if (req.body.password !== req.body.confirmPassword) {
         console.log("user pass wrong");
         return res.status(403).redirect("/user");
      }
      await sqlInsertIntoTable(req.body);
      console.log("user created");
      return res.status(200).redirect("/home");
   } catch {
      console.log("error occured");
      return res.status(500).redirect("/user");
   }
   // console.log(users);
});
app.post(
   "/user/login",
   passport.authenticate("local-login", {
      successRedirect: "/home",
      failureRedirect: "/",
      failureFlash: true,
   })
);

/*
app.post(
   "/user/login",
   passport.authenticate("local", {
      successRedirect: "/home",
      failureRedirect: "/",
      failureFlash: true,
   })
);

app.get("/login", (req, res) => {
   res.sendFile(path.join(__dirname, "..", "frontend", "html", "login.html"));
});

app.post(
   "/login",
   passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/register",
      failureFlash: true,
   })
);

app.get("/register", (req, res) => {
   res.render("register");
});

app.post("/user/login", async (req, res) => {
   try {
      const { email, password } = req.body;
      const mail = users.find((user) => user.email === req.body.email);
      // const mail = use_SQL_to_get_email(email);
      if (mail == null) {
         res.redirect("/user", { message: "Email not found" });
      }
      if (await bcrypt.compare(password, mail.password)) {
         // if (await bcrypt.compare(use_SQL_to_get_pass(email), password)) {
         res.redirect("/");
      } else {
         res.redirect("/user", { message: "Invalid email or password" });
      }
   } catch (error) {
      console.error("Login error:", error);
      res.redirect("/user", { message: "Some error occured" });
   }
});
*/

testOracleDBConnection = async () => {
   try {
      const connection = await oracledb.getConnection(dbConfig);
      console.log("Connected to Oracle Database");
      await connection.close();
   } catch (error) {
      console.error("Error connecting to Oracle Database:", error);
   }
};
testOracleDBConnection();

getDate = (timeStamp) => {
   const dateObj = new Date(timeStamp);
   const year = dateObj.getFullYear();
   const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
   const day = dateObj.getDate().toString().padStart(2, "0");
   return (formattedDate = `${day}/${month}/${year}`);
};

getTime = (timeStamp) => {
   const dateObj = new Date(timeStamp);
   const hours = dateObj.getHours().toString().padStart(2, "0");
   const minutes = dateObj.getMinutes().toString().padStart(2, "0");
   const seconds = dateObj.getSeconds().toString().padStart(2, "0");
   return (formattedTime = `${hours}:${minutes}:${seconds}`);
};

app.get(
   "/manage/:id",
   // checkAuthenticated,
   (req, res) => {
      res.render("event", {
         // user: req.user[6],
         // name: eventData[req.params.id][2],
         // type: eventData[req.params.id][4], // get using SQL
         // date: getDate(eventData[req.params.id][7]),
         // time: getTime(eventData[req.params.id][8]),
         // deadline: getDate(eventData[req.params.id][9]),
         // venue: eventData[req.params.id][5], // get using SQL
         // desc: eventData[req.params.id][3],
         // status: eventData[req.params.id][12],
         user: "ATTENDEE",
         name: eventData[req.params.id][2],
         type: eventData[req.params.id][4], // get using SQL
         date: getDate(eventData[req.params.id][7]),
         time: getTime(eventData[req.params.id][8]),
         deadline: getDate(eventData[req.params.id][9]),
         venue: eventData[req.params.id][5], // get using SQL
         desc: eventData[req.params.id][3],
         status: 1,
      });
   }
);

app.post("/create/event", async (req, res) => {
   try {
      const connection = await oracledb.getConnection(dbConfig);
      // const k = await generateUniqueKey(req.user[2], 4);
      const k = await generateUniqueKey("abc", 4);
      const key = "E" + k;

      console.log(req.body);
      const venueName = req.body.venue.substring(0, 16);
      const venueLoc = req.body.venue.substring(17);
      const venID = await connection.execute(
         `SELECT venue_id FROM VENUE WHERE name = '${venueName}' AND location = '${venueLoc}'`
      );
      const venueID = venID.rows[0][0];

      let temp = (req.user && req.user[0]) || 123;

      const eveDate = `${req.body.date} 00:00:00`;
      const eveTime = `2000-01-01 ${req.body.time}:00`;
      const regDeadline = `${req.body.deadline} 00:00:00`;

      console.log(key + " = " + typeof key);
      console.log(req.body.name + " = " + typeof req.body.name);
      console.log(
         typeof req.body.description + " = " + typeof req.body.description
      );
      console.log(req.body.eventType + " = " + typeof req.body.eventType);
      console.log(venueID + " = " + typeof venueID);
      console.log(temp + " = " + typeof temp);
      console.log(eveDate + " = " + typeof eveDate);
      console.log(eveTime + " = " + typeof eveTime);
      console.log(regDeadline + " = " + typeof regDeadline);

      console.log("~~~~~");

      /*
      [Object: null prototype] {
      name: 'dance',
      description: 'dancing people',
      date: '2024-04-09',
      time: '12:00',
      venue: 'ACADEMIC BLOCK-4 301',
      deadline: '2024-04-08',
      fee: '0',
      eventType: 'ET1'
      }

      ATTENDEE_ID -> null
      EVENT_ID -> gen
      EVENT_NAME -> have
      EVENT_DESCRIPTION -> have
      EVENT_TYPE_ID -> have
      VENUE_ID -> map
      ORGANIZER_ID -> have
      EVENT_DATE -> have
      EVENT_TIME -> have
      REGISTRATION_DEADLINE -> have
      REGISTRATION_ID -> null
      REGISTRATION_DATE -> null
      PAYMENT_STATUS_ID -> null
      */

      await connection.execute(`CREATE OR REPLACE PROCEDURE createEvent (
            v_event_id IN EVENTS.EVENT_ID%TYPE,
            v_event_name IN EVENTS.EVENT_NAME%TYPE,
            v_event_description IN EVENTS.EVENT_DESCRIPTION%TYPE,
            v_event_type_id IN EVENTS.EVENT_TYPE_ID%TYPE,
            v_venue_id IN EVENTS.VENUE_ID%TYPE,
            v_organizer_id IN EVENTS.ORGANIZER_ID%TYPE,
            v_event_date IN EVENTS.EVENT_DATE%TYPE,
            v_event_time IN EVENTS.EVENT_TIME%TYPE,
            v_registration_deadline IN EVENTS.REGISTRATION_DEADLINE%TYPE
         )
         AS
         BEGIN
            INSERT INTO EVENTS (
               EVENT_ID,
               EVENT_NAME,
               EVENT_DESCRIPTION,
               EVENT_TYPE_ID,
               VENUE_ID,
               ORGANIZER_ID,
               EVENT_DATE,
               EVENT_TIME,
               REGISTRATION_DEADLINE
            ) VALUES (
               v_event_id,
               v_event_name,
               v_event_description,
               v_event_type_id,
               v_venue_id,
               v_organizer_id,
               v_event_date,
               v_event_time,
               v_registration_deadline
            );
      
            DBMS_OUTPUT.PUT_LINE('Event created successfully!');
         EXCEPTION
            WHEN OTHERS THEN
               DBMS_OUTPUT.PUT_LINE('An error occurred: ' || SQLERRM);
         END createEvent;
         /
     `);

      const exe = await connection.execute(
         "select object_name from user_procedures"
      );
      console.log(exe.rows);

      await connection.execute(
         `BEGIN organizer_events ('${key}', '${req.body.name}', '${req.body.description}', '${req.body.eventType}', ${venueID}, ${temp},  SYSDATE, SYSDATE, SYSDATE); END;`
      );
      // await connection.execute(
      //    `INSERT INTO EVENTS
      //     (event_id, event_name, event_description, event_type_id, venue_id, organizer_id, event_date, event_time, registration_deadline)
      //     VALUES
      //     (:key, :name, :description, :eventType, :venueID, :temp, TO_DATE(:eveDate, 'YYYY-MM-DD HH24:MI:SS'), TO_DATE(:eveTime, 'YYYY-MM-DD HH24:MI:SS'), TO_DATE(:regDeadline, 'YYYY-MM-DD HH24:MI:SS'))`,
      //    {
      //       key: { dir: oracledb.BIND_IN, val: key, type: oracledb.STRING },
      //       name: {
      //          dir: oracledb.BIND_IN,
      //          val: req.body.name,
      //          type: oracledb.DB_TYPE_VARCHAR,
      //       },
      //       description: {
      //          dir: oracledb.BIND_IN,
      //          val: req.body.description,
      //          type: oracledb.DB_TYPE_VARCHAR,
      //       },
      //       eventType: {
      //          dir: oracledb.BIND_IN,
      //          val: req.body.eventType,
      //          type: oracledb.DB_TYPE_VARCHAR,
      //       },
      //       venueID: {
      //          dir: oracledb.BIND_IN,
      //          val: venueID,
      //          type: oracledb.NUMBER,
      //       },
      //       temp: { dir: oracledb.BIND_IN, val: temp, type: oracledb.NUMBER },
      //       eveDate: {
      //          dir: oracledb.BIND_IN,
      //          val: eveDate,
      //          type: oracledb.DATE,
      //       },
      //       eveTime: {
      //          dir: oracledb.BIND_IN,
      //          val: eveTime,
      //          type: oracledb.DATE,
      //       },
      //       regDeadline: {
      //          dir: oracledb.BIND_IN,
      //          val: regDeadline,
      //          type: oracledb.DATE,
      //       },
      //    }
      // );

      await connection.commit();
      await connection.close();
      console.log("user created");
      return res.status(200).redirect("/home");
   } catch (error) {
      console.error(error);
      console.log("error occured");
      return res.status(500).redirect("/user");
   }
});

app.get("/query", async (req, res) => {
   try {
      const connection = await oracledb.getConnection(dbConfig);

      const result = await connection.execute(
         `select * from EVENTS where ORGANIZER_ID = (select ORGANIZER_ID from ORGANIZERS where EMAIL = '${req.user[2]}')`
      );

      await connection.close();
      res.json(result.rows);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching data from OracleDB" });
   }
});

app.get("/test", async (req, res) => {
   try {
      const connection = await oracledb.getConnection(dbConfig);

      // const result = await connection.execute(
      //    "select * from attendee_organizer_combined"
      // );

      const result = await connection.execute("select * from EVENTS");

      result.metaData.forEach((data) => console.log(data.name));
      result.metaData.forEach((data) => console.log(data.name));

      await connection.close();
      res.json(result.rows);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching data from OracleDB" });
   }
});

/*
req.user ->
ID = 0
NAME = 1
EMAIL = 2
PASSWORD = 3
PHONE = 4
LOCATION = 5
TYPE = 6
*/

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
