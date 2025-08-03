const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');

connectToDb();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get('/', (req, res) => {
    res.send('Hello World');
});



app.get('/users/logout', (req, res) => {
  // logout logic
  res.json({ message: 'Logged out' });
});



app.use(cors({
  origin: 'http://localhost:5173', // ✅ Match your React dev server
  credentials: true
}));

// app.get('/users/profile', (req, res) => {
//   if (!req.session || !req.session.user) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   // Assuming user info is stored in session
//   res.json({ profile: req.session.user });
// });

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapsRoutes);
app.use('/rides', rideRoutes);

module.exports = app;