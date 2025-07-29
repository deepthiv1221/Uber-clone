require('dotenv').config();          // load .env variables early

const express = require('express');  // correct module
const cors    = require('cors');     // correct module

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = app;