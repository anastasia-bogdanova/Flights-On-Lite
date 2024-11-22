const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

// This is my route to get the access token
app.get('/get-token', async (req, res) => {
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});