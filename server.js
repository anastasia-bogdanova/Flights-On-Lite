// Bring in the express server and create application
const express = require('express');
const appExpress = express(); 
const axios = require('axios');

// This is where I store my API key and Secret
require('dotenv').config();

// API endpoint to handle the search request
app.post("/api/post", (req, res) => {
    const searchData = req.body;
    console.log("Received search data:", searchData);

// Add logic for calling an external API
    
// Send a response back to the front-end
    res.json({ message: "Data received successfully!", data: searchData });
});

// This is my route to get the access token
appExpress.get('/get-token', async (req, res) => {
  try {
    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', null, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params: {
        grant_type: 'client_credentials',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      },
    });
    res.json({ access_token: response.data.access_token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get access token' });
  }
});

//Cofigure router so all routes are prefixed with /api/v1.It adds slash api to all my local routes
appExpress.use('/api', router);

// Start the server
const server = appExpress.listen(3000, function () {
  console.log('Server is running on http://localhost:3000');
});
