const express = require("express");
const path = require("path");
const odb = require("./odb");

const app = express();
app.use(express.static(path.join(__dirname, "..", "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "..", "frontend", "html", "home.html"));
});
app.get("/login", (req, res) => {
   res.sendFile(path.join(__dirname, "..", "frontend", "html", "login.html"));
});
app.get("/dashboard", (req, res) => {
   res.sendFile(
      path.join(__dirname, "..", "frontend", "html", "dashboard.html")
   );
});
app.get("/find", (req, res) => {
   res.sendFile(path.join(__dirname, "..", "frontend", "html", "find.html"));
});
app.get("/create", (req, res) => {
   res.sendFile(path.join(__dirname, "..", "frontend", "html", "create.html"));
});
app.get("/manage", (req, res) => {
   res.sendFile(path.join(__dirname, "..", "frontend", "html", "manage.html"));
});
app.get("/history", (req, res) => {
   res.sendFile(path.join(__dirname, "..", "frontend", "html", "history.html"));
});
app.get("/event", (req, res) => {
   res.sendFile(path.join(__dirname, "..", "frontend", "html", "event.html"));
});

app.get("/api/users", (req, res) => {
   res.status(200).json({ hey: "hey hey hey" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
