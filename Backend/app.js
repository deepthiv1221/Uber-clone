const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const connectToDb = require('./db/db');  // Fixed typo: was "connnectToDb"

connectToDb();  // Fixed typo: was "connnectToDb"

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = app;
