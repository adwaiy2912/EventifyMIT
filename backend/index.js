const express = require('express');
const path = require('path');
const router = express.Router();

// Route to serve the main HTML file
router.get('/', (req, res) => {
    // Specify the absolute path to the HTML file directly
    const filePath = 'C:\\Users\\push2\\Desktop\\eventify2\\EventifyMIT\\html\\home.html';
    res.sendFile(filePath);
});

// Example API route for handling POST requests
router.post('/api/data', (req, res) => {
    // Handle the POST request here
    res.json({ message: 'Data received successfully!' });
});

module.exports = router;
