const http = require('http');        // correct spelling
const app  = require('./app');

const port = process.env.PORT || 3000;   // falls back to 3000 if .env missing
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
