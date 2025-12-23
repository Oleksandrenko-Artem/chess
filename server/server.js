const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

connectDB();

const server = http.createServer(app);

const port = 3000;

server.listen(port, () => {
    console.log('Server started at port ', port);
});