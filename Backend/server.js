require('dotenv').config();

const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const port = process.env.PORT || 3000;

console.log("Loaded KEY:", process.env.GOOGLE_MAPS_API_KEY);

const server = http.createServer(app);

initializeSocket(server);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});