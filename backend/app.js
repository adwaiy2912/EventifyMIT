const express = require("express");
const path = require("path");
const bodyParser = require("body-parser"); // Import body-parser to parse request body
const odb = require("./odb"); // Import the functions from odb.js

const app = express();

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Define a PUT route to handle PUT requests
app.get("/find-events", async (req, res) => {
   // Changed the route to '/find-events'
   try {
      // Call the function from odb.js to update data
      const result = await odb.queryTable();
      res.json(result); // Send the result back as response
      console.log(result);
   } catch (error) {
      console.error("Error updating data:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

// Serve static files from the directory containing home.html
app.use(
   express.static("C:\\Users\\push2\\Desktop\\eventify2\\EventifyMIT\\html")
);

// Define route for serving home.html
app.get("/", (req, res) => {
   try {
      // Send the home.html file
      res.sendFile(
         "C:\\Users\\push2\\Desktop\\eventify2\\EventifyMIT\\html\\home.html"
      );
   } catch (error) {
      console.error("Error serving home.html:", error);
      res.status(500).send("Internal server error");
   }
});

// Start the server
const PORT = process.env.PORT || 3001; // Changed the port number to 3001
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
