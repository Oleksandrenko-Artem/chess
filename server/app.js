const express = require('express');
const cors = require('cors');
const errorHandler = require('./errorHandler');
const userRouter = require('./routes/user.routes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

app.use('/users', userRouter);

app.use(errorHandler);

module.exports = app;