const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    console.log('Error ---> ', message);
    res.status(status).send({ error: [message] });
};

module.exports = errorHandler;