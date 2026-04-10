const express = require('express');
const app = express();

require('dotenv/config');

const api = process.env.API_URL;

app.listen(3000, () => {
console.log(`API URL is set to: ${api}`);
    console.log('Server is running on port 3000');
});