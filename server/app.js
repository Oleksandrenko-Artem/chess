const express = require('express');
const errorHandler = require('./errorHandler');
const userRouter = require('./routes/user.routes');


const app = express();

app.use(express.json());

app.use('/users', userRouter);

app.use(errorHandler);

module.exports = app;